import { ReactNode, FormEvent, useCallback, useEffect } from 'react'
import { mutate } from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Pal from 'models/Pal'
import usePal from 'hooks/usePal'
import useReload from 'hooks/useReload'
import Modal, { IsModalShowingProps } from '..'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface AuthModalProps extends IsModalShowingProps {
	className: string
	title: string
	isLoading: boolean
	isDisabled: boolean
	errorMessage: string | null
	onSubmit(): Promise<Pal | undefined>
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
	const reload = useReload()
	const isAuthorized = Boolean(usePal())

	const onSubmitEvent = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const pal = await onSubmit()
			if (!pal) return

			mutate('auth', pal)
			reload()
		},
		[onSubmit, reload]
	)

	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])

	useEffect(() => {
		if (isAuthorized) setIsShowing(false)
	}, [isAuthorized, setIsShowing])

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
					<button
						className={styles.submit}
						disabled={isDisabled}
						aria-busy={isLoading}
					>
						{isLoading ? <Spinner className={styles.spinner} /> : 'next'}
					</button>
					{errorMessage && <p className={styles.error}>{errorMessage}</p>}
				</footer>
			</form>
		</Modal>
	)
}

export default AuthModal
