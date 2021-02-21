import { PoolClient } from 'pg'
import HttpError from '../utils/HttpError'

import Pal from './Pal'
import Pen from './Pen'
import PenPal from './PenPal'

enum Role {
	Owner = 'owner',
	Editor = 'editor',
	Viewer = 'viewer'
}

export default Role

export enum PublicRole {
	Editor = 'editor',
	Viewer = 'viewer'
}

export const combineRole = (
	role: Role | null | undefined,
	publicRole: PublicRole | null | undefined
) => (role ?? publicRole ?? null) as Role | null

export const getRoles = async (
	client: PoolClient,
	role: Role | null,
	penId: string
): Promise<PenPal[]> => {
	const { rows: pals } = await client.query<
		PenPal & { active?: boolean },
		[string]
	>(
		`
		SELECT
			pals.id,
			pals.name,
			${role === Role.Owner ? 'pals.email,' : ''}
			roles.role
		FROM roles
		JOIN pals ON pals.id = roles.pal_id
		WHERE roles.pen_id = $1
		ORDER BY roles.created DESC
		`,
		[penId]
	)

	for (const pal of pals) {
		if (role !== Role.Owner) pal.email = null
		pal.active = true
	}

	return pals
}

export const getRole = async (
	client: PoolClient,
	palId: string | undefined,
	penId: string
): Promise<Role | null> => {
	const { rows: pens } = await client.query<
		{ public_role: PublicRole | null; role?: Role | null },
		[string, string] | [string]
	>(
		palId
			? `
			SELECT
				pens.role AS public_role,
				roles.role
			FROM pens
			LEFT JOIN roles ON
				roles.pal_id = $1 AND
				roles.pen_id = $2
			WHERE pens.id = $2
			`
			: `
			SELECT role AS public_role
			FROM pens
			WHERE id = $1
			`,
		palId ? [palId, penId] : [penId]
	)

	const pen = pens[0]
	if (!pen) return null

	return combineRole(pen.role, pen.public_role)
}

export const getPrivateRole = async (
	client: PoolClient,
	palId: string,
	penId: string
): Promise<Role | null> => {
	const { rows } = await client.query<{ role: Role }, [string, string]>(
		`
		SELECT role
		FROM roles
		WHERE pal_id = $1 AND pen_id = $2
		`,
		[palId, penId]
	)

	return rows[0]?.role ?? null
}

export const createRole = async (client: PoolClient, pal: Pal, pen: Pen) => {
	await client.query<Record<string, never>, [string, string, string]>(
		`
		INSERT INTO roles (pal_id, pen_id, role)
		VALUES ($1, $2, $3)
		`,
		[pal.id, pen.id, pen.role]
	)
}

export interface EditRoleOptions {
	role: Role.Viewer | Role.Editor
	active: boolean
}

export const editRole = async (
	client: PoolClient,
	pal: Pal,
	palId: string,
	penId: string,
	{ role: newRole, active }: EditRoleOptions
) => {
	if (pal.id === palId)
		throw new HttpError(403, 'You cannot edit your own role')

	const role = await getPrivateRole(client, pal.id, penId)

	if (role !== Role.Owner)
		throw new HttpError(403, 'You must own this pen to edit roles')

	await client.query<Record<string, never>, [string, string, Role]>(
		`
		UPDATE ${active ? 'roles' : 'invites'}
		SET role = $3
		WHERE
			${active ? 'pal_id' : 'id'} = $1 AND
			pen_id = $2
		`,
		[palId, penId, newRole]
	)
}

export interface DeleteRoleOptions {
	active: boolean
}

export const deleteRole = async (
	client: PoolClient,
	pal: Pal,
	palId: string,
	penId: string,
	{ active }: DeleteRoleOptions
) => {
	if (pal.id === palId)
		throw new HttpError(403, 'You cannot remove yourself from this pen')

	const role = await getPrivateRole(client, pal.id, penId)

	if (role !== Role.Owner)
		throw new HttpError(403, 'You must own this pen to remove pals')

	await client.query<Record<string, never>, [string, string]>(
		`
		DELETE FROM ${active ? 'roles' : 'invites'}
		WHERE
			${active ? 'pal_id' : 'id'} = $1 AND
			pen_id = $2
		`,
		[palId, penId]
	)
}

export const deleteOwnRole = async (
	client: PoolClient,
	pal: Pal,
	penId: string
) => {
	const role = await getPrivateRole(client, pal.id, penId)

	if (!role) throw new HttpError(403, 'This pen is not in your library')
	if (role === Role.Owner)
		throw new HttpError(403, 'You cannot remove your own pen from your library')

	await client.query<Record<string, never>, [string, string]>(
		`
		DELETE FROM roles
		WHERE pal_id = $1 AND pen_id = $2
		`,
		[pal.id, penId]
	)
}
