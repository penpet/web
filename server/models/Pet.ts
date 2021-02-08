import Pal from './Pal'
import Role from './Role'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'
import database from '../database'

export default interface Pet {
	id: string
	name: string
	body: string
	created: string
	updated: string
}

export const createPet = async (pal: Pal) => {
	const { rows: pets } = await database.query<Pet, [string, string]>(
		'INSERT INTO pets (id, name) VALUES ($1, $2) RETURNING *',
		[newId(), 'Untitled']
	)

	const pet = pets[0]
	if (!pet) throw new HttpError(500, 'Unable to create pet')

	await createRole(pal, pet, Role.Owner)

	return pet
}

export const createRole = async (pal: Pal, pet: Pet, role: Role) => {
	await database.query<Record<string, never>, [string, string, string]>(
		'INSERT INTO roles (pal_id, pet_id, role) VALUES ($1, $2, $3)',
		[pal.id, pet.id, role]
	)
}
