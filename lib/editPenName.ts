import { fetchVoid } from './fetch'

const editPenName = (id: string, name: string) =>
	fetchVoid(`pens/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	})

export default editPenName
