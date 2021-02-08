import { NextPageContext } from 'next'

import Pal from 'models/Pal'
import { ORIGIN } from './constants'

const getPal = async ({ req }: NextPageContext): Promise<Pal | null> => {
	try {
		const cookie = req?.headers.cookie

		const response = await fetch(`${ORIGIN}/auth`, {
			headers: cookie ? { cookie } : undefined
		})

		return response.json()
	} catch {
		return null
	}
}

export default getPal
