import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCrown,
	faEdit,
	faEye,
	faTrash
} from '@fortawesome/free-solid-svg-icons'

import PenPal from 'models/PenPal'
import Pen from 'models/Pen'
import Role from 'models/Role'
import _setRole from 'lib/setRole'
import _deleteRole from 'lib/deleteRole'
import handleError from 'lib/handleError'
import usePal from 'hooks/usePal'

import styles from './index.module.scss'

export interface PenPagePalProps {
	pal: PenPal
	pen: Pen
}

const PenPagePal = ({ pal, pen }: PenPagePalProps) => {
	const self = usePal()

	const [isLoading, setIsLoading] = useState(false)

	const isOwner = pen.role === Role.Owner
	const isCollaboratorOwner = pal.role === Role.Owner

	const setRole = useCallback(
		async (role: Role) => {
			if (!isOwner || isCollaboratorOwner || isLoading) return

			try {
				setIsLoading(true)
				await _setRole(pen.id, pal, role)
			} catch (error) {
				handleError(error)
			} finally {
				setIsLoading(false)
			}
		},
		[pen.id, pal, isOwner, isCollaboratorOwner, isLoading]
	)

	const edit = useCallback(() => setRole(Role.Editor), [setRole])
	const view = useCallback(() => setRole(Role.Viewer), [setRole])

	const deleteRole = useCallback(async () => {
		if (!isOwner || isCollaboratorOwner || isLoading) return

		if (!confirm(`Are you sure you want to remove ${pal.name} from this pen?`))
			return

		try {
			setIsLoading(true)
			await _deleteRole(pen.id, pal)
		} catch (error) {
			handleError(error)
		} finally {
			setIsLoading(false)
		}
	}, [pen.id, pal, isOwner, isCollaboratorOwner, isLoading, setIsLoading])

	return (
		<div className={styles.root}>
			<p className={styles.name}>
				{pal.name ?? pal.email ?? '(error)'}
				{pal.id === self?.id && <span className={styles.meta}> (me)</span>}
				{pal.active || <span className={styles.meta}> (invited)</span>}
			</p>
			{isCollaboratorOwner ? (
				<FontAwesomeIcon className={styles.owner} icon={faCrown} />
			) : isOwner ? (
				<div className={styles.roles}>
					<button
						className={styles.role}
						disabled={!isOwner || isLoading}
						onClick={view}
						aria-selected={pal.role === Role.Viewer}
					>
						<FontAwesomeIcon icon={faEye} />
					</button>
					<button
						className={styles.role}
						disabled={!isOwner || isLoading}
						onClick={edit}
						aria-selected={pal.role === Role.Editor}
					>
						<FontAwesomeIcon icon={faEdit} />
					</button>
				</div>
			) : (
				<FontAwesomeIcon
					className={styles.roleIcon}
					icon={pal.role === Role.Viewer ? faEye : faEdit}
				/>
			)}
			{isOwner && !isCollaboratorOwner && (
				<button
					className={styles.delete}
					onClick={deleteRole}
					disabled={isLoading}
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			)}
		</div>
	)
}

export default PenPagePal
