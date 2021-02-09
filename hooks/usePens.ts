import { useMemo, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { toast } from 'react-toastify'
import useSWR from 'swr'

import { PenData, penFromData } from 'models/Pen'
import fetch from 'lib/fetch'
import pensState from 'state/pens'

const usePens = () => {
	const initialPens = useRecoilValue(pensState)
	const { data, error } = useSWR<PenData[], unknown>('pens', fetch)

	const pens = useMemo(
		() =>
			data
				?.map(penFromData)
				.sort((a, b) => b.updated.getTime() - a.updated.getTime()),
		[data]
	)

	useEffect(() => {
		if (error)
			toast.error(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
	}, [error])

	return pens ?? initialPens
}

export default usePens
