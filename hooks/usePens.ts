import { useMemo, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import useSWR from 'swr'

import { PenData, penFromData } from 'models/Pen'
import fetch from 'lib/fetch'
import sortPens from 'lib/sortPens'
import handleError from 'lib/handleError'
import pensState from 'state/pens'
import usePal from './usePal'

const usePens = () => {
	const pal = usePal()
	const initialPens = useRecoilValue(pensState)

	const { data, error } = useSWR<PenData[], unknown>(pal && 'pens', fetch)
	const pens = useMemo(() => data && sortPens(data.map(penFromData)), [data])

	useEffect(() => {
		if (error) handleError(error)
	}, [error])

	return pal ? pens ?? initialPens : []
}

export default usePens
