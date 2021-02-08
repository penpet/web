import { useState, useCallback, ChangeEvent } from 'react'

import Pal from 'models/Pal'
import { API_ORIGIN } from 'lib/constants'
import { IsModalShowingProps } from '..'
import Modal from '../Auth'

import styles from './index.module.scss'

const SignUpModal = ({ isShowing, setIsShowing }: IsModalShowingProps) => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const isDisabled = !(name && email && password)

	const onSubmit = useCallback(async (): Promise<Pal | void> => {
		if (isLoading || isDisabled) return

		try {
			setIsLoading(true)

			const response = await fetch(`${API_ORIGIN}/auth/sign-up`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
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

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value)
		},
		[setName]
	)

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
			title="Sign up"
			isLoading={isLoading}
			isDisabled={isDisabled}
			errorMessage={errorMessage}
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<label htmlFor="sign-up-modal-name-input">Name</label>
			<input
				id="sign-up-modal-name-input"
				autoComplete="name"
				placeholder="John Smith"
				value={name}
				onChange={onNameChange}
			/>
			<label htmlFor="sign-up-modal-email-input">Email</label>
			<input
				id="sign-up-modal-email-input"
				type="email"
				autoComplete="email"
				placeholder="name@example.com"
				value={email}
				onChange={onEmailChange}
			/>
			<label htmlFor="sign-up-modal-password-input">Password</label>
			<input
				id="sign-up-modal-password-input"
				type="password"
				autoComplete="new-password"
				placeholder="••••••"
				value={password}
				onChange={onPasswordChange}
			/>
		</Modal>
	)
}

export default SignUpModal
