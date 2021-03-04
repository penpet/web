import { useRef, useEffect } from 'react'
import useSWR from 'swr'

import PenPal from 'models/PenPal'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'

const usePals = (penId: string, isShowing: boolean) => {
	const previous = useRef<PenPal[] | undefined>()

	const { data: current, error, mutate } = useSWR<PenPal[], unknown>(
		isShowing ? `pens/${penId}/pals` : null,
		fetch,
		{ initialData: previous.current }
	)

	useEffect(() => {
		previous.current = current
	}, [previous, current])

	useEffect(() => {
		if (isShowing) mutate()
	}, [isShowing, mutate])

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return current ?? null
}

export default usePals
