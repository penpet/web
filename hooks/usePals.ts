import { useRef, useEffect } from 'react'
import useSWR from 'swr'

import PenPal from 'models/PenPal'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'

const usePals = (penId: string, shouldLoad = true) => {
	const previous = useRef<PenPal[] | undefined>()

	const { data: pals, error } = useSWR<PenPal[], unknown>(
		shouldLoad ? `pens/${penId}/pals` : null,
		fetch,
		{ initialData: previous.current }
	)

	useEffect(() => {
		previous.current = pals
	}, [previous, pals])

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return pals
}

export default usePals
