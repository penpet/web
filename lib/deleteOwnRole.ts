import { mutate } from 'swr'
import Router from 'next/router'

import { PenData } from 'models/Pen'
import { fetchVoid } from './fetch'

const deleteOwnRole = async (id: string) => {
	await fetchVoid(`roles/${id}`, { method: 'DELETE' })

	mutate('pens', (pens: PenData[] | undefined) =>
		pens?.filter(pen => pen.id !== id)
	)

	mutate(`pens/${id}`, null)

	Router.replace('/')
}

export default deleteOwnRole
