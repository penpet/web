import { FormEvent, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faLink,
	faEye,
	faEdit,
	faShareSquare,
	faEyeSlash
} from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import Role, { PublicRole } from 'models/Role'
import editPublicRole from 'lib/editPublicRole'
import handleError from 'lib/handleError'
import { ORIGIN } from 'lib/constants'

import styles from './index.module.scss'

export interface PenLinkProps {
	pen: Pen
}

const PenLink = ({ pen }: PenLinkProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const { id, public_role: role } = pen
	const isOwner = pen.role === Role.Owner

	const isDisabled = !role

	const setRole = useCallback(
		async (role: PublicRole | null) => {
			if (!isOwner || isLoading) return

			try {
				setIsLoading(true)
				await editPublicRole(id, role)
			} catch (error) {
				handleError(error)
			} finally {
				setIsLoading(false)
			}
		},
		[id, isOwner, isLoading, setIsLoading]
	)

	const none = useCallback(() => setRole(null), [setRole])
	const view = useCallback(() => setRole(PublicRole.Viewer), [setRole])
	const edit = useCallback(() => setRole(PublicRole.Editor), [setRole])

	const copyLink = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			copy(`${ORIGIN}/${pen.id}`)
			toast.dark('Copied link to clipboard')
		},
		[pen.id]
	)

	return (
		<form className={styles.root} onSubmit={copyLink}>
			<div className={styles.header}>
				<label htmlFor="pals-modal-pen-link-input">
					<FontAwesomeIcon className={styles.icon} icon={faLink} />
					link
				</label>
				{isOwner ? (
					<div className={styles.roles}>
						<button
							className={styles.role}
							type="button"
							disabled={isLoading}
							onClick={none}
							aria-selected={role === null}
						>
							<FontAwesomeIcon icon={faEyeSlash} />
						</button>
						<button
							className={styles.role}
							type="button"
							disabled={isLoading}
							onClick={view}
							aria-selected={role === PublicRole.Viewer}
						>
							<FontAwesomeIcon icon={faEye} />
						</button>
						<button
							className={styles.role}
							type="button"
							disabled={isLoading}
							onClick={edit}
							aria-selected={role === PublicRole.Editor}
						>
							<FontAwesomeIcon icon={faEdit} />
						</button>
					</div>
				) : (
					<p className={styles.description}>
						anyone with this link can{' '}
						{pen.public_role === PublicRole.Viewer ? 'view' : 'edit'}
					</p>
				)}
			</div>
			<div className={styles.footer}>
				<input
					id="pals-modal-pen-link-input"
					className={styles.link}
					readOnly
					disabled={isDisabled}
					value={`${ORIGIN}/${pen.id}`}
				/>
				<button className={styles.copy} disabled={isDisabled}>
					<FontAwesomeIcon icon={faShareSquare} />
				</button>
			</div>
		</form>
	)
}

export default PenLink
