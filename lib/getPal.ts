import { NextPageContext } from 'next'

import Pal from 'models/Pal'
import fetch from 'lib/fetch'

const getPal = async ({ req }: NextPageContext) => {
	const cookie = req?.headers.cookie

	return fetch<Pal | null>('auth', {
		headers: cookie ? { cookie } : undefined
	})
}

export default getPal
