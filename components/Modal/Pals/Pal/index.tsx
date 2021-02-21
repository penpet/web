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

	const setRole = useCallback((role: Role) => {
		console.log(`Set role to ${role}`)
	}, [])

	const edit = useCallback(() => {
		setRole(Role.Editor)
	}, [setRole])

	const view = useCallback(() => {
		setRole(Role.Viewer)
	}, [setRole])

	const deleteRole = useCallback(() => {
		console.log('Delete role')
	}, [isLoading])

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
