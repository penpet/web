import { PoolClient } from 'pg'

import Pal from './Pal'
import Role, {
	PublicRole,
	createRole,
	combineRole,
	getPrivateRole,
	serializeRole
} from './Role'
import getPreview, { Delta } from './Preview'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'

export interface PenData {
	id: string
	name: string
	public_role: PublicRole | null
	created: string
	updated: string
	preview?: string
}

export default interface Pen extends PenData {
	role: Role
}

export const getPens = async (client: PoolClient, pal: Pal) => {
	const { rows: pens } = await client.query<Pen, [string]>(
		`
		SELECT
			pens.id,
			pens.name,
			pens.role AS public_role,
			pens.created,
			pens.updated,
			roles.role
		FROM pens
		JOIN roles ON roles.pen_id = pens.id
		WHERE roles.pal_id = $1
		`,
		[pal.id]
	)

	return pens
}

export const getPen = async (
	client: PoolClient,
	pal: Pal | undefined,
	id: string,
	includePreview = false
): Promise<Pen> => {
	const { rows: pens } = await client.query<
		Omit<PenData, 'preview'> & { role?: Role | null; preview?: Delta },
		[string, string] | [string]
	>(
		`
		SELECT
			pens.id,
			pens.name,
			pens.role AS public_role,
			pens.created,
			pens.updated
			${pal ? ', roles.role' : ''}
			${includePreview ? ', snapshots.data AS preview' : ''}
		FROM pens
		${pal ? 'LEFT JOIN roles ON roles.pal_id = $1 AND roles.pen_id = pens.id' : ''}
		${includePreview ? 'JOIN snapshots ON snapshots.id = pens.id' : ''}
		WHERE pens.id = ${pal ? '$2' : '$1'}
		`,
		pal ? [pal.id, id] : [id]
	)

	const data = pens[0]
	if (!data) throw new HttpError(404, 'Pen not found')

	const pen = {
		...data,
		preview: data.preview && getPreview(data.preview)
	}

	if (pal && serializeRole(pen.role) < serializeRole(pen.public_role)) {
		const role = (pen.public_role as unknown) as Role

		await client.query<Record<string, never>, [string, string, Role]>(
			pen.role
				? `
				UPDATE roles
				SET role = $3
				WHERE pal_id = $1 AND pen_id = $2
				`
				: `
				INSERT INTO roles (pal_id, pen_id, role)
				VALUES ($1, $2, $3)
				`,
			[pal.id, pen.id, role]
		)

		return { ...pen, role }
	}

	const role = combineRole(pen.role, pen.public_role)
	if (!role) throw new HttpError(401, 'Private pen')

	return { ...pen, role }
}

export const createPen = async (client: PoolClient, pal: Pal) => {
	const { rows: pens } = await client.query<PenData, [string]>(
		`
		INSERT INTO pens (id)
		VALUES ($1)
		RETURNING *
		`,
		[newId()]
	)

	const data = pens[0]
	if (!data) throw new HttpError(500, 'Unable to create pen')

	const pen: Pen = { ...data, role: Role.Owner }
	await createRole(client, pal, pen)

	return pen
}

export const editPenName = async (
	client: PoolClient,
	pal: Pal,
	penId: string,
	name: string
) => {
	const role = await getPrivateRole(client, pal.id, penId)

	if (role !== Role.Owner)
		throw new HttpError(
			403,
			'You must be the owner of this pen to change its name'
		)

	await client.query<Record<string, never>, [string, string]>(
		`
		UPDATE pens
		SET name = $2
		WHERE id = $1
		`,
		[penId, name]
	)
}

export const editPublicRole = async (
	client: PoolClient,
	pal: Pal,
	penId: string,
	newRole: PublicRole | null
) => {
	const role = await getPrivateRole(client, pal.id, penId)

	if (role !== Role.Owner)
		throw new HttpError(
			403,
			'You must be the owner of this pen to change link permissions'
		)

	await client.query<Record<string, never>, [string, PublicRole | null]>(
		`
		UPDATE pens
		SET role = $2
		WHERE id = $1
		`,
		[penId, newRole]
	)
}

export const deletePen = async (
	client: PoolClient,
	pal: Pal,
	penId: string
) => {
	const role = await getPrivateRole(client, pal.id, penId)

	if (role !== Role.Owner)
		throw new HttpError(403, 'You must be the owner of this pen to delete it')

	await client.query<Record<string, never>, [string]>(
		`
		DELETE FROM pens
		WHERE id = $1
		`,
		[penId]
	)
}
