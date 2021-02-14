import { PoolClient } from 'pg'

import Pal from './Pal'
import Role, { createRole } from './Role'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'

export interface PenData {
	id: string
	name: string
	public: boolean
	created: string
	updated: string
}

export default interface Pen extends PenData {
	role: Role
}

export const getPens = async (client: PoolClient, pal: Pal) => {
	const { rows: pens } = await client.query<Pen, [string]>(
		'SELECT pens.id, pens.name, pens.public, pens.created, pens.updated, roles.role FROM pens JOIN roles ON roles.pen_id = pens.id WHERE roles.pal_id = $1',
		[pal.id]
	)

	return pens
}

export const canViewPen = async (
	client: PoolClient,
	pal: Pal | undefined,
	id: string
) => {
	const { rows: pens } = await client.query<
		{ public: boolean; role: Role | null | undefined },
		[string, string] | [string]
	>(
		pal
			? 'SELECT pens.public, roles.role FROM pens LEFT JOIN roles ON roles.pal_id = $1 AND roles.pen_id = $2 WHERE pens.id = $2'
			: 'SELECT public FROM pens WHERE id = $1',
		pal ? [pal.id, id] : [id]
	)

	const pen = pens[0]
	return Boolean(pen && (pen.public || pen.role))
}

export const getPen = async (
	client: PoolClient,
	pal: Pal | undefined,
	id: string
): Promise<Pen> => {
	const { rows: pens } = await client.query<
		PenData & { role: Role | null | undefined },
		[string, string] | [string]
	>(
		pal
			? 'SELECT pens.id, pens.name, pens.public, pens.created, pens.updated, roles.role FROM pens LEFT JOIN roles ON roles.pal_id = $1 AND roles.pen_id = pens.id WHERE pens.id = $2'
			: 'SELECT id, name, public, created, updated FROM pens WHERE pens.id = $1',
		pal ? [pal.id, id] : [id]
	)

	const pen = pens[0]

	if (!pen) throw new HttpError(404, 'Pen not found')
	if (!(pen.public || pen.role)) throw new HttpError(401, 'Private pen')

	return { ...pen, role: pen.role ?? Role.Viewer }
}

export const createPen = async (client: PoolClient, pal: Pal) => {
	const { rows: pens } = await client.query<PenData, [string, string, boolean]>(
		'INSERT INTO pens (id, name, public) VALUES ($1, $2, $3) RETURNING *',
		[newId(), 'Untitled', false]
	)

	const data = pens[0]
	if (!data) throw new HttpError(500, 'Unable to create pen')

	const pen: Pen = { ...data, role: Role.Owner }
	await createRole(client, pal, pen)

	return pen
}
