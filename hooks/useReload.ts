import { useRouter } from 'next/router'
import { useCallback } from 'react'

const useReload = () => {
	const router = useRouter()

	return useCallback(() => {
		router.replace(router.asPath)
	}, [router])
}

export default useReload
