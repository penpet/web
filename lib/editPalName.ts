import { fetchVoid } from './fetch'

const editPalName = (name: string) =>
	fetchVoid('auth', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	})

export default editPalName
