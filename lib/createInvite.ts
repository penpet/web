import { mutate } from 'swr'

import PenPal from 'models/PenPal'
import Role from 'models/Role'
import fetch from './fetch'

const createInvite = async (penId: string, email: string, role: Role) => {
	const pal = await fetch<PenPal>(`pens/${penId}/pals`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, role })
	})

	mutate(`pens/${penId}/pals`, (pals: PenPal[] | undefined) => [
		pal,
		...(pals ?? [])
	])

	return pal
}

export default createInvite
