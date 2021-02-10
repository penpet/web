import { useMemo, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { toast } from 'react-toastify'
import useSWR from 'swr'

import { PenData, penFromData } from 'models/Pen'
import fetch from 'lib/fetch'
import sortPens from 'lib/sortPens'
import palState from 'state/pal'
import pensState from 'state/pens'

const usePens = () => {
	const pal = useRecoilValue(palState)
	const initialPens = useRecoilValue(pensState)

	const { data, error } = useSWR<PenData[], unknown>(pal && 'pens', fetch)
	const pens = useMemo(() => data && sortPens(data.map(penFromData)), [data])

	useEffect(() => {
		if (error)
			toast.error(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
	}, [error])

	return pal ? pens ?? initialPens : []
}

export default usePens