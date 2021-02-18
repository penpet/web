import { PoolClient } from 'pg'
import HttpError from '../utils/HttpError'

import Pal from './Pal'
import Role, { getRoles, getRole } from './Role'
import { getInvites } from './Invite'

export default interface PenPal {
	id: string
	name: string | null
	email: string | null
	role: Role
	active: boolean
}

export const getPenPals = async (
	client: PoolClient,
	pal: Pal | undefined,
	penId: string
) => {
	const role = await getRole(client, pal, penId)
	if (!role) throw new HttpError(401, 'Private pen')

	const [invites, roles] = await Promise.all([
		getInvites(client, role, penId),
		getRoles(client, role, penId)
	])

	return [...invites, ...roles]
}
