import { useRef, useMemo, useEffect } from 'react'
import useSWR from 'swr'

import PenPal from 'models/PenPal'
import { serializeRole } from 'models/Role'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'

const usePals = (penId: string, shouldLoad = true) => {
	const previousData = useRef<PenPal[] | undefined>()

	const { data, error } = useSWR<PenPal[], unknown>(
		shouldLoad ? `pens/${penId}/pals` : null,
		fetch,
		{ initialData: previousData.current }
	)

	const pals = useMemo(
		() =>
			data &&
			data.sort((a, b) => serializeRole(a.role) - serializeRole(b.role)),
		[data]
	)

	useEffect(() => {
		previousData.current = data
	}, [previousData, data])

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return pals
}

export default usePals
