import { PoolClient } from 'pg'

import Pal from './Pal'
import Pen from './Pen'

enum Role {
	Owner = 'owner',
	Editor = 'editor',
	Viewer = 'viewer'
}

export const createRole = async (client: PoolClient, pal: Pal, pen: Pen) => {
	await client.query<Record<string, never>, [string, string, string]>(
		'INSERT INTO roles (pal_id, pen_id, role) VALUES ($1, $2, $3)',
		[pal.id, pen.id, pen.role]
	)
}

export default Role
