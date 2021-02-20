import useSWR from 'swr'

import { PenData } from 'models/Pen'
import HttpError from 'models/HttpError'
import fetch from 'lib/fetch'

const usePen = (id: string | undefined) => {
	const { data, error } = useSWR<PenData | null, unknown>(
		id ? `pens/${id}` : null,
		fetch
	)

	return error
		? error instanceof HttpError
			? error.status
			: 500
		: data ?? null
}

export default usePen
