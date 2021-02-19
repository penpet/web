import { useMemo, useEffect } from 'react'
import useSWR from 'swr'

import { PenData, penFromData } from 'models/Pen'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'

const usePen = (initialPen: PenData | null) => {
	const { data, error } = useSWR<PenData | null, unknown>(
		initialPen && `pens/${initialPen.id}`,
		fetch,
		{ initialData: initialPen }
	)

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return useMemo(() => (data ? penFromData(data) : null), [data])
}

export default usePen
