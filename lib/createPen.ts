import Pen from 'models/Pen'
import { ORIGIN } from './constants'

const createPen = async (): Promise<Pen> => {
	const response = await fetch(`${ORIGIN}/pens`, { method: 'POST' })

	if (response.ok) return response.json()
	throw new Error(await response.text())
}

export default createPen
