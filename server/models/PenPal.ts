import { PoolClient } from 'pg'

import Role from './Role'

export default interface PenPal {
	id: string
	name: string
	role: Role
	active: boolean
}

export const getPenPals = async (client: PoolClient, penId: string) => {
	const { rows: pals } = await client.query<PenPal, [string]>(
		'SELECT pals.id, pals.name, roles.role, roles.active FROM pals JOIN roles ON roles.pal_id = pals.id WHERE roles.pen_id = $1',
		[penId]
	)

	return pals
}
