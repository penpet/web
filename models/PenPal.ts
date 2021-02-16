import Role from './Role'

export default interface PenPal {
	id: string
	name: string
	role: Role
	active: boolean
}
