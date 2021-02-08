import { NextPageContext } from 'next'

import Pal from 'models/Pal'
import { API_ORIGIN } from './constants'

const getPal = async ({ req }: NextPageContext): Promise<Pal | null> => {
	try {
		const cookie = req?.headers.cookie

		const response = await fetch(`${API_ORIGIN}/auth`, {
			credentials: 'include',
			headers: cookie ? { cookie } : undefined
		})

		return response.json()
	} catch {
		return null
	}
}

export default getPal
