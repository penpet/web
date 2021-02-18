import { useState, useCallback, ChangeEvent } from 'react'
import { useRecoilState } from 'recoil'

import Pal from 'models/Pal'
import fetch from 'lib/fetch'
import { signUpModalState } from 'state/authModal'
import authState from 'state/auth'
import Modal from '../Auth'

import styles from './index.module.scss'

const SignUpModal = () => {
	const [isShowing, setIsShowing] = useRecoilState(signUpModalState)
	const [{ name, email, password }, setState] = useRecoilState(authState)

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const isDisabled = !(name && email && password)

	const onSubmit = useCallback(async () => {
		if (isLoading || isDisabled) return

		try {
			setIsLoading(true)

			return await fetch<Pal>('auth/sign-up', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			})
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
			setState(state => ({ ...state, name: event.target.value }))
		},
		[setState]
	)

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
			title="sign up"
			isLoading={isLoading}
			isDisabled={isDisabled}
			errorMessage={errorMessage}
			onSubmit={onSubmit}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<label htmlFor="sign-up-modal-name-input">name</label>
			<input
				id="sign-up-modal-name-input"
				autoComplete="name"
				placeholder="John Smith"
				value={name}
				onChange={onNameChange}
			/>
			<label htmlFor="sign-up-modal-email-input">email</label>
			<input
				id="sign-up-modal-email-input"
				type="email"
				autoComplete="email"
				placeholder="name@example.com"
				value={email}
				onChange={onEmailChange}
			/>
			<label htmlFor="sign-up-modal-password-input">password</label>
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
