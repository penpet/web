import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import createPet from 'lib/createPet'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

const SidebarCreatePet = () => {
	const [isLoading, setIsLoading] = useState(false)

	const onCreatePet = useCallback(async () => {
		try {
			setIsLoading(true)
			await createPet()
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
		} finally {
			setIsLoading(false)
		}
	}, [setIsLoading])

	return (
		<div className={styles.root}>
			<h3 className={styles.title}>my pets</h3>
			<button
				className={styles.button}
				onClick={onCreatePet}
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

export default SidebarCreatePet
