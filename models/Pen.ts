import Role from './Role'

export interface PenData {
	id: string
	name: string
	public: boolean
	created: string
	updated: string
	role: Role
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
