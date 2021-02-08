import { compare, hash } from 'bcrypt'

import HttpError from '../utils/HttpError'
import newId from '../utils/newId'
import database from '../database'

const SALT_ROUNDS = 10

export default interface Pal {
	id: string
	name: string
	email: string
	password: string
}

export type PublicPal = Omit<Pal, 'password'>

export const palToPublic = ({ id, name, email }: Pal): PublicPal => ({
	id,
	name,
	email
})

export const createPal = async (
	name: string,
	email: string,
	password: string
) => {
	const pal: Pal = {
		id: newId(),
		name,
		email,
		password: await hash(password, SALT_ROUNDS)
	}

	await database.query<Pal, [string, string, string, string]>(
		'INSERT INTO pals (id, name, email, password) VALUES ($1, $2, $3, $4)',
		[pal.id, pal.name, pal.email, pal.password]
	)

	return pal
}

export const palFromCredential = async (email: string, password: string) => {
	const { rows: pals } = await database.query<Pal, [string]>(
		'SELECT id, name, email, password FROM pals WHERE email = $1',
		[email]
	)

	const pal = pals[0]

	if (!pal) throw new HttpError(404, 'No user with the specified email')
	if (await compare(password, pal.password)) return pal

	throw new HttpError(401, 'Incorrect password')
}

export const palFromId = async (id: string) => {
	const { rows: pals } = await database.query<Pal, [string]>(
		'SELECT id, name, email, password FROM pals WHERE id = $1',
		[id]
	)

	const pal = pals[0]
	if (pal) return pal

	throw new HttpError(404, 'No user with the specified ID')
}
