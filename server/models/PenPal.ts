import { PoolClient } from 'pg'
import HttpError from '../utils/HttpError'

import Pal from './Pal'
import Role, { getRole } from './Role'
import sendEmail from '../utils/sendEmail'

export default interface PenPal {
	id: string
	name: string | null
	email: string | null
	role: Role
	active: boolean
}

export interface Invite {
	email: string
	role: Role.Viewer | Role.Editor
}

const getInvites = async (
	client: PoolClient,
	role: Role | null,
	penId: string
): Promise<PenPal[]> => {
	if (role !== Role.Owner) return []

	const { rows: pals } = await client.query<
		PenPal & { active?: boolean },
		[string]
	>(
		`
		SELECT
			invites.id,
			pals.name,
			invites.email,
			invites.role
		FROM invites
		LEFT JOIN pals ON pals.email = invites.email
		WHERE invites.pen_id = $1
		ORDER BY invites.created DESC
		`,
		[penId]
	)

	for (const pal of pals) pal.active = false
	return pals
}

const getRoles = async (
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

export const createInvite = async (
	client: PoolClient,
	penId: string,
	pal: Pal,
	invite: Invite
) => {
	const { rows: pens } = await client.query<
		{ name: string; role: Role },
		[string, string]
	>(
		`
		SELECT
			pens.name,
			roles.role
		FROM pens
		LEFT JOIN roles ON
			roles.pal_id = $1 AND
			roles.pen_id = $2
		WHERE pens.id = $2
		`,
		[pal.id, penId]
	)

	const pen = pens[0]
	if (!pen) throw new HttpError(404, 'Pen not found')

	if (pen.role !== Role.Owner)
		throw new HttpError(
			403,
			'You must be the owner of this pen to invite people'
		)
	
	try {
		await client.query('BEGIN')
		
		sendEmail({
			from: 'penpet invites <invites@pen.pet>',
			to: invite.email,
			replyTo: pal.email,
			template: 'invite',
			context: {
				id: ,
				from: pal.name,
				to: ,
				pen: pen.name,
				role: ,
			}
		})
		
		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	}
}
