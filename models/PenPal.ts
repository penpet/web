import Role from './Role'

export default interface PenPal {
	id: string
	name: string | null
	email: string | null
	role: Role
	active: boolean
}
