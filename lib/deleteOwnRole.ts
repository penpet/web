import { fetchVoid } from './fetch'

const deleteOwnRole = (id: string) =>
	fetchVoid(`roles/${id}`, { method: 'DELETE' })

export default deleteOwnRole
