import { useState } from 'react'
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

	return (
		<>
			<button className={styles.root}>
				<FontAwesomeIcon className={styles.icon} icon={faUsers} />
				Pals
			</button>
			<PalsModal pen={pen} isShowing={isShowing} setIsShowing={setIsShowing} />
		</>
	)
}

export default PenPagePals
