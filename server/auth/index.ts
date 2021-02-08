import { compare, hash } from 'bcrypt'

import Pal from '../models/Pal'
import newId from '../utils/newId'
import database from '../database'

const SALT_ROUNDS = 10

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

	if (!pal) throw new Error('No user with the specified email')
	if (await compare(password, pal.password)) return pal

	throw new Error('Incorrect password')
}

export const palFromId = async (id: string) => {
	const { rows: pals } = await database.query<Pal, [string]>(
		'SELECT id, name, email, password FROM pals WHERE id = $1',
		[id]
	)

	const pal = pals[0]
	if (pal) return pal

	throw new Error('No user with the specified ID')
}
