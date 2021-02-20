import useSWR from 'swr'

import { PenData } from 'models/Pen'
import HttpError from 'models/HttpError'
import fetch from 'lib/fetch'

const usePen = (id: string | undefined) => {
	const { data, error } = useSWR<PenData | null, unknown>(
		id ? `pens/${id}` : null,
		fetch
	)
	console.log(id, data, error)
	return error ? (error instanceof HttpError ? error.status : 500) : data
}

export default usePen
