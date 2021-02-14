import { NextPageContext } from 'next'

import { PenData } from 'models/Pen'
import fetch from './fetch'

const getPen = ({ req }: NextPageContext, id: string) => {
	const cookie = req?.headers.cookie

	return fetch<PenData>(`pens/${id}`, {
		headers: cookie ? { cookie } : undefined
	})
}

export default getPen
