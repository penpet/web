import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import createPen from 'lib/createPen'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

const SidebarCreatePen = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onCreatePen = useCallback(async () => {
		try {
			setIsLoading(true)
			await createPen()
		} catch (error) {
			handleError(error)
		} finally {
			setIsLoading(false)
		}
	}, [setIsLoading])

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
