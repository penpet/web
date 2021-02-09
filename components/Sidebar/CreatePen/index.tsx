import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import createPen from 'lib/createPen'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'
import { SOCKET_ORIGIN } from 'lib/constants'

const SidebarCreatePen = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onCreatePen = useCallback(async () => {
		try {
			setIsLoading(true)
			await createPen()
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
		} finally {
			setIsLoading(false)
		}
	}, [setIsLoading])

	useEffect(() => {
		const socket = new WebSocket(`${SOCKET_ORIGIN}/pens`)

		socket.addEventListener('message', ({ data }) => {
			console.log('DATA:', data)
		})

		socket.addEventListener('error', () => {
			toast.error('An unknown error occurred')
		})

		return () => socket.close()
	}, [])

	return (
		<div className={styles.root}>
			<h3 className={styles.title}>my pens</h3>
			<button
				className={styles.button}
				onClick={onCreatePen}
				aria-busy={isLoading}
			>
				{isLoading ? (
					<Spinner className={styles.spinner} />
				) : (
					<FontAwesomeIcon icon={faPlusCircle} />
				)}
			</button>
		</div>
	)
}

export default SidebarCreatePen
