import Role from 'models/Role'
import fetch from './fetch'

const invite = async (penId: string, email: string, role: Role) => {
	await fetch(`pens/${penId}/pals`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, role })
	})
}

export default invite
