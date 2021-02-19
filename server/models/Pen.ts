import { PoolClient } from 'pg'

import Pal from './Pal'
import Role, {
	PublicRole,
	createRole,
	combineRole,
	getPrivateRole
} from './Role'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'

export interface PenData {
	id: string
	name: string
	public_role: PublicRole | null
	created: string
	updated: string
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
	id: string
): Promise<Pen> => {
	const { rows: pens } = await client.query<
		PenData & { role?: Role | null },
		[string, string] | [string]
	>(
		pal
			? `
			SELECT
				pens.id,
				pens.name,
				pens.role AS public_role,
				pens.created,
				pens.updated,
				roles.role
			FROM pens
			LEFT JOIN roles ON
				roles.pal_id = $1 AND
				roles.pen_id = pens.id
			WHERE pens.id = $2
			`
			: `
			SELECT
				id,
				name,
				role AS public_role,
				created,
				updated
			FROM pens
			WHERE pens.id = $1
			`,
		pal ? [pal.id, id] : [id]
	)

	const pen = pens[0]
	if (!pen) throw new HttpError(404, 'Pen not found')

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
	const role = await getPrivateRole(client, pal, penId)

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
