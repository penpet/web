import { NextPageContext } from 'next'

import { PenData } from 'models/Pen'
import fetch from 'lib/fetch'

const getPens = async ({ req }: NextPageContext) => {
	const cookie = req?.headers.cookie

	return fetch<PenData[]>('pens', {
		headers: cookie ? { cookie } : undefined
	})
}

export default getPens
