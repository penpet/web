import { ReactNode } from 'react'

import styles from './index.module.scss'

export interface ErrorMessageProps {
	children?: ReactNode
}

const ErrorMessage = ({ children }: ErrorMessageProps) => (
	<div className={styles.root}>
		<h3 className={styles.title}>Uh oh!</h3>
		<p className={styles.message}>{children}</p>
	</div>
)

export default ErrorMessage
