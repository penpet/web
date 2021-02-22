import {
	FormEvent,
	ChangeEvent,
	useRef,
	useState,
	useCallback,
	useEffect
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEdit,
	faEnvelope,
	faEye,
	faPlus
} from '@fortawesome/free-solid-svg-icons'

import Pen from 'models/Pen'
import Role from 'models/Role'
import createInvite from 'lib/createInvite'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface PenPageInviteProps {
	pen: Pen
	isShowing: boolean
}

const PenPageInvite = ({ pen, isShowing }: PenPageInviteProps) => {
	const emailRef = useRef<HTMLInputElement | null>(null)

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
				await createInvite(pen.id, email, role)

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

	useEffect(() => {
		emailRef.current?.focus()
	}, [emailRef])

	return (
		<form className={styles.root} onSubmit={onSubmit}>
			<input
				ref={emailRef}
				className={styles.email}
				type="email"
				autoComplete={isShowing ? 'email' : 'off'}
				placeholder="email"
				value={email}
				onChange={onEmailChange}
			/>
			<FontAwesomeIcon className={styles.emailIcon} icon={faEnvelope} />
			<div className={styles.roles}>
				<button
					className={styles.role}
					type="button"
					disabled={isLoading}
					onClick={view}
					aria-selected={role === Role.Viewer}
				>
					<FontAwesomeIcon icon={faEye} />
				</button>
				<button
					className={styles.role}
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
