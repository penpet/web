import { PoolClient } from 'pg'

import Pal from './Pal'
import PenPal from './PenPal'
import Role from './Role'
import HttpError from '../utils/HttpError'
import newId from '../utils/newId'
import sendEmail from '../utils/sendEmail'

export interface InviteData {
	pen_id: string
	email: string
	role: Role.Viewer | Role.Editor
}

export interface InviteMeta extends Invite {
	pen_name: string
}

export default interface Invite extends InviteData {
	id: string
}

export const getInvites = async (
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

export const getInvite = async (client: PoolClient, id: string) => {
	const { rows: invites } = await client.query<InviteMeta, [string]>(
		`
		SELECT
			invites.id,
			pens.id AS pen_id,
			pens.name AS pen_name,
			invites.email,
			invites.role
		FROM invites
		JOIN pens ON pens.id = invites.pen_id
		WHERE invites.id = $1
		`,
		[id]
	)

	const invite = invites[0]
	if (invite) return invite

	throw new HttpError(404, 'Invite not found')
}

export const createInvite = async (
	client: PoolClient,
	from: Pal,
	invite: InviteData
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
		[from.id, invite.pen_id]
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
		[invite.email, invite.pen_id]
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
			[id, invite.pen_id, invite.email, invite.role]
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

export const acceptInvite = async (
	client: PoolClient,
	pal: Pal,
	invite: Invite
) => {
	if (pal.email !== invite.email)
		throw new HttpError(403, 'This invite was not meant for you')

	try {
		await client.query('BEGIN')

		await Promise.all([
			client.query<Record<string, never>, [string]>(
				`
				DELETE FROM invites
				WHERE id = $1
				`,
				[invite.id]
			),
			client.query<Record<string, never>, [string, string, Role]>(
				`
				INSERT INTO roles (pal_id, pen_id, role)
				VALUES ($1, $2, $3)
				`,
				[pal.id, invite.pen_id, invite.role]
			)
		])

		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	}

	return invite.pen_id
}
