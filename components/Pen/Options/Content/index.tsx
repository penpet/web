import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEdit,
	faFolderMinus,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Pen from 'models/Pen'
import Role from 'models/Role'

import styles from './index.module.scss'

export interface PenOptionsContentProps {
	pen: Pen
	editName(): void
	setIsShowing(isShowing: boolean): void
}

const PenOptionsContent = ({
	pen,
	editName: _editName,
	setIsShowing
}: PenOptionsContentProps) => {
	const isOwner = pen.role === Role.Owner

	const editName = useCallback(() => {
		_editName()
		setIsShowing(false)
	}, [_editName, setIsShowing])

	return (
		<>
			<button
				className={styles.action}
				disabled={!isOwner}
				onClick={editName}
				data-balloon-pos="up"
				aria-label="Rename this pen"
			>
				<FontAwesomeIcon icon={faEdit} />
			</button>
			<button
				className={cx(styles.action, styles.danger)}
				data-balloon-pos="up"
				aria-label="Remove from your pens"
			>
				<FontAwesomeIcon icon={faFolderMinus} />
			</button>
			<button
				className={cx(styles.action, styles.danger)}
				disabled={!isOwner}
				data-balloon-pos="up"
				aria-label="Permanently delete this pen"
			>
				<FontAwesomeIcon icon={faTrash} />
			</button>
		</>
	)
}

export default PenOptionsContent
export const contentClassName = styles.root
