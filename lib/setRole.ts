import { mutate } from 'swr'

import PenPal from 'models/PenPal'
import Role from 'models/Role'
import { fetchVoid } from './fetch'

const setRole = async (penId: string, { id, active }: PenPal, role: Role) => {
	await fetchVoid(`pens/${penId}/pals/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ role, active })
	})

	mutate(`pens/${penId}/pals`, (pals: PenPal[] | undefined) =>
		pals?.map(pal => (pal.id === id ? { ...pal, role } : pal))
	)
}

export default setRole
