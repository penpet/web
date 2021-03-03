import Role, { PublicRole } from './Role'

export interface PenData {
	id: string
	name: string
	public_role: PublicRole | null
	created: string
	updated: string
	role: Role
	preview?: string
}

export default interface Pen extends Omit<Omit<PenData, 'created'>, 'updated'> {
	created: Date
	updated: Date
}

export const penFromData = (data: PenData): Pen => ({
	...data,
	created: new Date(data.created),
	updated: new Date(data.updated)
})
