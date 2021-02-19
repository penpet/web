import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEdit,
	faFolderMinus,
	faTrash
} from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Pen from 'models/Pen'
import Role from 'models/Role'
import deleteOwnRole from 'lib/deleteOwnRole'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'

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
	const [isDeleteRoleLoading, setIsDeleteRoleLoading] = useState(false)

	const isOwner = pen.role === Role.Owner

	const editName = useCallback(() => {
		if (!isOwner) return

		_editName()
		setIsShowing(false)
	}, [isOwner, _editName, setIsShowing])

	const deleteRole = useCallback(async () => {
		if (isOwner || isDeleteRoleLoading) return

		try {
			setIsDeleteRoleLoading(true)
			await deleteOwnRole(pen.id)
		} catch (error) {
			handleError(error)
		} finally {
			setIsDeleteRoleLoading(false)
		}
	}, [pen.id, isOwner, isDeleteRoleLoading, setIsDeleteRoleLoading])

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
				disabled={isOwner}
				onClick={deleteRole}
				data-balloon-pos="up"
				aria-label="Remove from my pens"
				aria-busy={isDeleteRoleLoading}
			>
				{isDeleteRoleLoading ? (
					<Spinner className={styles.spinner} />
				) : (
					<FontAwesomeIcon icon={faFolderMinus} />
				)}
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
