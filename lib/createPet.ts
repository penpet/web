import Pet from 'models/Pet'
import { ORIGIN } from './constants'

const createPet = async (): Promise<Pet> => {
	const response = await fetch(`${ORIGIN}/pets`, { method: 'POST' })

	if (response.ok) return response.json()
	throw new Error(await response.text())
}

export default createPet
