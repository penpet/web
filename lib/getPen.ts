import { NextPageContext } from 'next'

import { PenData } from 'models/Pen'
import fetch from './fetch'

const getPen = (
	{ req }: NextPageContext,
	id: string,
	includePreview = false
) => {
	const cookie = req?.headers.cookie

	return fetch<PenData>(`pens/${id}`, {
		headers: cookie ? { cookie } : undefined,
		query: { preview: includePreview ? '1' : null }
	})
}

export default getPen
