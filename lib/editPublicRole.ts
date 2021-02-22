import { mutate } from 'swr'

import { PenData } from 'models/Pen'
import { PublicRole } from 'models/Role'
import { fetchVoid } from './fetch'

const editPublicRole = async (id: string, role: PublicRole | null) => {
	await fetchVoid(`pens/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ role })
	})

	mutate('pens', (pens: PenData[] | undefined) =>
		pens?.map(pen => (pen.id === id ? { ...pen, public_role: role } : pen))
	)

	mutate(
		`pens/${id}`,
		(pen: PenData | null | undefined) => pen && { ...pen, public_role: role }
	)
}

export default editPublicRole
