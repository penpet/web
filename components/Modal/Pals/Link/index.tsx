import { FormEvent, useCallback } from 'react'
import { toast } from 'react-toastify'
import copy from 'copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faShareSquare } from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import { ORIGIN } from 'lib/constants'

import styles from './index.module.scss'

export interface PenLinkProps {
	pen: Pen
}

const PenLink = ({ pen }: PenLinkProps) => {
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
			<label className={styles.title} htmlFor="pals-modal-pen-link-input">
				<FontAwesomeIcon className={styles.icon} icon={faLink} />
				link
			</label>
			<div className={styles.footer}>
				<input
					id="pals-modal-pen-link-input"
					className={styles.link}
					readOnly
					value={`${ORIGIN}/${pen.id}`}
				/>
				<button className={styles.copy}>
					<FontAwesomeIcon icon={faShareSquare} />
				</button>
			</div>
		</form>
	)
}

export default PenLink
