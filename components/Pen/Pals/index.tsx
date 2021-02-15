import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import PalsModal from 'components/Modal/Pals'

import styles from './index.module.scss'

export interface PenPagePalsProps {
	pen: Pen
}

const PenPagePals = ({ pen }: PenPagePalsProps) => {
	const [isShowing, setIsShowing] = useState(false)

	const show = useCallback(() => {
		setIsShowing(true)
	}, [setIsShowing])

	return (
		<>
			<button className={styles.root} onClick={show}>
				<FontAwesomeIcon className={styles.icon} icon={faUsers} />
				pals
			</button>
			<PalsModal pen={pen} isShowing={isShowing} setIsShowing={setIsShowing} />
		</>
	)
}

export default PenPagePals
