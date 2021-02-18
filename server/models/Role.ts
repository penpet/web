import { PoolClient } from 'pg'

import Pal from './Pal'
import Pen from './Pen'
import PenPal from './PenPal'

enum Role {
	Owner = 'owner',
	Editor = 'editor',
	Viewer = 'viewer'
}

export default Role

export enum PublicRole {
	Editor = 'editor',
	Viewer = 'viewer'
}

export const combineRole = (
	role: Role | null | undefined,
	publicRole: PublicRole | null | undefined
) => (role ?? publicRole ?? null) as Role | null

export const getRoles = async (
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

export const getRole = async (
	client: PoolClient,
	pal: Pal | undefined,
	penId: string
) => {
	const { rows: pens } = await client.query<
		{ public_role: PublicRole | null; role?: Role | null },
		[string, string] | [string]
	>(
		pal
			? `
			SELECT
				pens.role AS public_role,
				roles.role
			FROM pens
			LEFT JOIN roles ON
				roles.pal_id = $1 AND
				roles.pen_id = $2
			WHERE pens.id = $2
			`
			: `
			SELECT role AS public_role
			FROM pens
			WHERE id = $1
			`,
		pal ? [pal.id, penId] : [penId]
	)

	const pen = pens[0]
	if (!pen) return null

	return combineRole(pen.role, pen.public_role)
}

export const createRole = async (client: PoolClient, pal: Pal, pen: Pen) => {
	await client.query<Record<string, never>, [string, string, string]>(
		`
		INSERT INTO roles (pal_id, pen_id, role)
		VALUES ($1, $2, $3)
		`,
		[pal.id, pen.id, pen.role]
	)
}
