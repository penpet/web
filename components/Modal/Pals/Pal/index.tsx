import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import Pal from 'models/Pal'
import Pen from 'models/Pen'
import Role from 'models/Role'

import styles from './index.module.scss'

export interface PenPagePalProps {
	pal: Pal
	pen: Pen
}

const PenPagePal = ({ pal, pen }: PenPagePalProps) => {
	const deleteRole = useCallback(() => {
		console.log('Remove role')
	}, [])

	return (
		<div className={styles.root}>
			<p className={styles.name}>{pal.name}</p>
			{}
			{pen.role === Role.Owner && (
				<button onClick={deleteRole}>
					<FontAwesomeIcon className={styles.delete} icon={faTrash} />
				</button>
			)}
		</div>
	)
}

export default PenPagePal
