import { mutate } from 'swr'

import { PenData } from 'models/Pen'
import { fetchVoid } from './fetch'

const editPenName = async (id: string, name: string) => {
	await fetchVoid(`pens/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	})

	mutate('pens', (pens: PenData[]) =>
		pens.map(pen => (pen.id === id ? { ...pen, name } : pen))
	)

	mutate(
		`pens/${id}`,
		(pen: PenData | null | undefined) => pen && { ...pen, name }
	)
}

export default editPenName
