import { useState, useCallback, ChangeEvent } from 'react'

import Pal from 'models/Pal'
import { API_ORIGIN } from 'lib/constants'
import { IsModalShowingProps } from '..'
import Modal from '../Auth'

import styles from './index.module.scss'

const LogInModal = ({ isShowing, setIsShowing }: IsModalShowingProps) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const isDisabled = !(email && password)

	const onSubmit = useCallback(async (): Promise<Pal | void> => {
		if (isLoading || isDisabled) return

		try {
			setIsLoading(true)

			const response = await fetch(`${API_ORIGIN}/auth/log-in`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})

			if (response.ok) return response.json()
			throw new Error(await response.text())
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
			setEmail(event.target.value)
		},
		[setEmail]
	)

	const onPasswordChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPassword(event.target.value)
		},
		[setPassword]
	)

	return (
		<Modal
			className={styles.root}
			title="Log in"
			isLoading={isLoading}
			isDisabled={isDisabled}
			errorMessage={errorMessage}
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<label htmlFor="log-in-modal-email-input">Email</label>
			<input
				id="log-in-modal-email-input"
				type="email"
				autoComplete="email"
				placeholder="name@example.com"
				value={email}
				onChange={onEmailChange}
			/>
			<label htmlFor="log-in-modal-password-input">Password</label>
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
