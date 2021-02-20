import Router from 'next/router'
import { mutate } from 'swr'

import { PenData } from 'models/Pen'
import { fetchVoid } from './fetch'

const deletePen = async (id: string) => {
	await fetchVoid(`pens/${id}`, { method: 'DELETE' })

	mutate('pens', (pens: PenData[] | undefined) =>
		pens?.filter(pen => pen.id !== id)
	)

	mutate(`pens/${id}`, null)

	Router.replace('/')
}

export default deletePen
