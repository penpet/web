import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import styles from './index.module.scss'

export interface PalsHeaderProps {
	setIsShowing(isShowing: boolean): void
}

const PalsHeader = ({ setIsShowing }: PalsHeaderProps) => {
	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<header className={styles.root}>
			<h3 className={styles.title}>my pals</h3>
			<button className={styles.hide} onClick={hide}>
				<FontAwesomeIcon icon={faTimesCircle} />
			</button>
		</header>
	)
}

export default PalsHeader
