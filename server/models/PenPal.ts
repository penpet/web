import { PoolClient } from 'pg'
import HttpError from '../utils/HttpError'

import Pal from './Pal'
import Role, { getRole } from './Role'
import newId from '../utils/newId'
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
	from: Pal,
	invite: Invite
): Promise<PenPal> => {
	const { rows: pens } = await client.query<
		{ name: string; role: Role | null },
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
		[from.id, penId]
	)

	const pen = pens[0]
	if (!pen) throw new HttpError(404, 'Pen not found')

	if (pen.role !== Role.Owner)
		throw new HttpError(
			403,
			'You must be the owner of this pen to invite people'
		)

	const { rows: tos } = await client.query<
		{ name: string; role: Role | null },
		[string, string]
	>(
		`
		SELECT pals.name, roles.role
		FROM pals
		LEFT JOIN roles ON
			roles.pal_id = pals.id AND
			roles.pen_id = $2
		WHERE pals.email = $1
		`,
		[invite.email, penId]
	)

	const to = tos[0]

	if (to?.role)
		throw new HttpError(
			403,
			`${to.name} is already a${to.role === Role.Viewer ? '' : 'n'} ${to.role}`
		)

	const id = newId()

	try {
		await client.query('BEGIN')

		await client.query<Record<string, never>, [string, string, string, Role]>(
			`
			INSERT INTO invites (id, pen_id, email, role)
			VALUES ($1, $2, $3, $4)
			`,
			[id, penId, invite.email, invite.role]
		)

		await sendEmail({
			from: 'penpet invites <invites@pen.pet>',
			to: invite.email,
			replyTo: from.email,
			template: 'invite',
			context: {
				id,
				from: from.name,
				to: to?.name ?? invite.email,
				pen: pen.name,
				role: invite.role === Role.Viewer ? 'view' : 'edit'
			}
		})

		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	}

	return {
		id,
		name: to ? to.name : null,
		email: invite.email,
		role: invite.role,
		active: false
	}
}
