import Router from 'next/router'
import { mutate } from 'swr'

import { PenData } from 'models/Pen'
import { fetchVoid } from './fetch'

const deleteOwnRole = async (id: string) => {
	await fetchVoid(`roles/${id}`, { method: 'DELETE' })

	const pens: PenData[] = await mutate('pens', (pens: PenData[]) =>
		pens.filter(pen => pen.id !== id)
	)

	Router.replace(`/${pens[0]?.id ?? ''}`)
}

export default deleteOwnRole
