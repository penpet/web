import { ReactNode, FormEvent, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Modal, { IsModalShowingProps } from '..'

import styles from './index.module.scss'
import Spinner from 'components/Spinner'

export interface AuthModalProps extends IsModalShowingProps {
	className: string
	title: string
	isLoading: boolean
	isDisabled: boolean
	errorMessage: string | null
	onSubmit(): void
	children?: ReactNode
}

const AuthModal = ({
	className,
	title,
	isLoading,
	isDisabled,
	errorMessage,
	onSubmit,
	isShowing,
	setIsShowing,
	children
}: AuthModalProps) => {
	const onSubmitEvent = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			onSubmit()
		},
		[onSubmit]
	)

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	return (
		<Modal
			className={cx(styles.root, className)}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<form onSubmit={onSubmitEvent}>
				<header className={styles.details}>
					<h3 className={styles.title}>{title}</h3>
					<button className={styles.hide} type="button" onClick={hide}>
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
				</header>
				<div className={styles.fields}>{children}</div>
				<footer className={styles.details}>
					<button className={styles.submit} disabled={isDisabled}>
						{isLoading ? <Spinner className={styles.spinner} /> : 'Next'}
					</button>
					{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				</footer>
			</form>
		</Modal>
	)
}

export default AuthModal
