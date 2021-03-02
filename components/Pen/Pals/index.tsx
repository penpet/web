import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Pen from 'models/Pen'
import PalsModal from 'components/Modal/Pals'

import styles from './index.module.scss'

export interface PenPagePalsProps {
	className?: string
	pen: Pen
}

const PenPagePals = ({ className, pen }: PenPagePalsProps) => {
	const [isShowing, setIsShowing] = useState(false)

	const show = useCallback(() => {
		setIsShowing(true)
	}, [setIsShowing])

	return (
		<>
			<button className={cx(styles.root, className)} onClick={show}>
				<FontAwesomeIcon className={styles.icon} icon={faUsers} />
				pals
			</button>
			<PalsModal
				key={pen.id}
				pen={pen}
				isShowing={isShowing}
				setIsShowing={setIsShowing}
			/>
		</>
	)
}

export default PenPagePals
