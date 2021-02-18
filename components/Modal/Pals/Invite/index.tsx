import { FormEvent, ChangeEvent, useState, useCallback } from 'react'
import { mutate } from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEdit,
	faEnvelope,
	faEye,
	faPlus
} from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import PenPal from 'models/PenPal'
import Role from 'models/Role'
import createInvite from 'lib/createInvite'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PenPageInviteProps {
	pen: Pen
}

const PenPageInvite = ({ pen }: PenPageInviteProps) => {
	const [email, setEmail] = useState('')
	const [role, setRole] = useState(Role.Editor)

	const [isLoading, setIsLoading] = useState(false)
	const isDisabled = !email || isLoading

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (isDisabled) return

			try {
				setIsLoading(true)

				const pal = await createInvite(pen.id, email, role)

				mutate(`pens/${pen.id}/pals`, (pals: PenPal[] | undefined) => [
					pal,
					...(pals ?? [])
				])

				setEmail('')
			} catch (error) {
				handleError(error)
			} finally {
				setIsLoading(false)
			}
		},
		[pen.id, email, role, isDisabled, setEmail, setIsLoading]
	)

	const onEmailChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setEmail(event.target.value)
		},
		[setEmail]
	)

	const view = useCallback(() => {
		setRole(Role.Viewer)
	}, [setRole])

	const edit = useCallback(() => {
		setRole(Role.Editor)
	}, [setRole])

	return (
		<form className={styles.root} onSubmit={onSubmit}>
			<input
				className={styles.email}
				type="email"
				placeholder="Email"
				value={email}
				onChange={onEmailChange}
			/>
			<FontAwesomeIcon className={styles.emailIcon} icon={faEnvelope} />
			<div className={styles.roles}>
				<button
					className={styles.viewer}
					type="button"
					disabled={isLoading}
					onClick={view}
					aria-selected={role === Role.Viewer}
				>
					<FontAwesomeIcon icon={faEye} />
				</button>
				<button
					className={styles.editor}
					type="button"
					disabled={isLoading}
					onClick={edit}
					aria-selected={role === Role.Editor}
				>
					<FontAwesomeIcon icon={faEdit} />
				</button>
			</div>
			<button className={styles.submit} disabled={isDisabled}>
				{isLoading ? (
					<Spinner className={styles.spinner} />
				) : (
					<FontAwesomeIcon icon={faPlus} />
				)}
			</button>
		</form>
	)
}

export default PenPageInvite
