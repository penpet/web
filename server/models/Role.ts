import Pal from './Pal'
import Pen from './Pen'
import database from '../database'

enum Role {
	Owner = 'owner',
	Editor = 'editor',
	Viewer = 'viewer'
}

export const createRole = async (pal: Pal, pen: Pen) => {
	await database.query<Record<string, never>, [string, string, string]>(
		'INSERT INTO roles (pal_id, pen_id, role) VALUES ($1, $2, $3)',
		[pal.id, pen.id, pen.role]
	)
}

export default Role
