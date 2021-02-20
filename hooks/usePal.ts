import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useSWR from 'swr'

import Pal from 'models/Pal'
import fetch from 'lib/fetch'
import handleError from 'lib/handleError'
import palState from 'state/pal'

const usePal = () => {
	const initialPal = useRecoilValue(palState)

	const { data, error } = useSWR<Pal | null, unknown>('auth', fetch, {
		initialData: initialPal
	})

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return data ?? null
}

export default usePal
