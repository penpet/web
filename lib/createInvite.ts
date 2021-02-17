import PenPal from 'models/PenPal'
import Role from 'models/Role'
import fetch from './fetch'

const createInvite = async (penId: string, email: string, role: Role) =>
	fetch<PenPal>(`pens/${penId}/pals`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, role })
	})

export default createInvite
