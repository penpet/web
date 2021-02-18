import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import Modal, { IsModalShowingProps } from '..'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

const UploadModal = ({ isShowing, setIsShowing }: IsModalShowingProps) => {
	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<header className={styles.header}>
				<h3 className={styles.title}>Uploading...</h3>
				<button className={styles.hide} type="button" onClick={hide}>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</header>
			<Spinner className={styles.spinner} />
		</Modal>
	)
}

export default UploadModal
