import { mutate } from 'swr'

import { PenData } from 'models/Pen'
import fetch from 'lib/fetch'

const createPen = async () => {
	const pen = await fetch<PenData>('pens', {
		method: 'POST'
	})

	mutate('pens', (pens: PenData[] | undefined) => [pen, ...(pens ?? [])])

	return pen
}

export default createPen
