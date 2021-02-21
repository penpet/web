import { mutate } from 'swr'

import PenPal from 'models/PenPal'
import { fetchVoid } from './fetch'

const deleteRole = async (penId: string, { id, active }: PenPal) => {
	await fetchVoid(`pens/${penId}/pals/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ active })
	})

	mutate(`pens/${penId}/pals`, (pals: PenPal[] | undefined) =>
		pals?.filter(pal => pal.id !== id)
	)
}

export default deleteRole
