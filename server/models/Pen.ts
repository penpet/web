import Pal from './Pal'
import Role, { createRole } from './Role'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'
import database from '../database'

export interface PenData {
	id: string
	name: string
	body: string
	created: string
	updated: string
}

export default interface Pen extends PenData {
	role: Role
}

export const getPens = async (pal: Pal) => {
	const { rows: pens } = await database.query<Pen, [string]>(
		'SELECT pens.id, pens.name, pens.body, pens.created, pens.updated, roles.role FROM roles JOIN pens ON roles.pal_id = $1 AND roles.pen_id = pens.id',
		[pal.id]
	)

	return pens
}

export const createPen = async (pal: Pal) => {
	const { rows: pens } = await database.query<PenData, [string, string]>(
		'INSERT INTO pens (id, name) VALUES ($1, $2) RETURNING *',
		[newId(), 'Untitled']
	)

	const data = pens[0]
	if (!data) throw new HttpError(500, 'Unable to create pen')

	const pen: Pen = { ...data, role: Role.Owner }
	await createRole(pal, pen)

	return pen
}
