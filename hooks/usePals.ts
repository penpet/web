import { useMemo, useEffect } from 'react'
import useSWR from 'swr'

import PenPal from 'models/PenPal'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'
import { serializeRole } from 'models/Role'

const usePals = (penId: string) => {
	const { data, error } = useSWR<PenPal[], unknown>(`pens/${penId}/pals`, fetch)

	const pals = useMemo(
		() =>
			data &&
			data.sort((a, b) => serializeRole(a.role) - serializeRole(b.role)),
		[data]
	)

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return pals
}

export default usePals
