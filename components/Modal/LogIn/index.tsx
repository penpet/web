import { useState, useCallback, ChangeEvent } from 'react'
import { useRecoilState } from 'recoil'

import Pal from 'models/Pal'
import fetch from 'lib/fetch'
import { logInModalState } from 'state/authModal'
import authState from 'state/auth'
import Modal from '../Auth'

import styles from './index.module.scss'

const LogInModal = () => {
	const [isShowing, setIsShowing] = useRecoilState(logInModalState)
	const [{ email, password }, setState] = useRecoilState(authState)

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const isDisabled = !(email && password)

	const onSubmit = useCallback(async () => {
		if (isLoading || isDisabled) return

		try {
			setIsLoading(true)

			return fetch<Pal>('auth/log-in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
		} finally {
			setIsLoading(false)
		}
	}, [email, password, isLoading, isDisabled, setIsLoading, setErrorMessage])

	const onEmailChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setState(state => ({ ...state, email: event.target.value }))
		},
		[setState]
	)

	const onPasswordChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setState(state => ({ ...state, password: event.target.value }))
		},
		[setState]
	)

	return (
		<Modal
			className={styles.root}
			title="log in"
			isLoading={isLoading}
			isDisabled={isDisabled}
			errorMessage={errorMessage}
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<label htmlFor="log-in-modal-email-input">email</label>
			<input
				id="log-in-modal-email-input"
				type="email"
				autoComplete="email"
				placeholder="name@example.com"
				value={email}
				onChange={onEmailChange}
			/>
			<label htmlFor="log-in-modal-password-input">password</label>
			<input
				id="log-in-modal-password-input"
				type="password"
				autoComplete="current-password"
				placeholder="••••••"
				value={password}
				onChange={onPasswordChange}
			/>
		</Modal>
	)
}

export default LogInModal
