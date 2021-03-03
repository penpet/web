import Role from './Role'

export default interface Invite {
	id: string
	pen_id: string
	pen_name: string
	email: string
	role: Role.Viewer | Role.Editor
}
