import styles from './index.module.scss'

export interface ErrorPageProps {
	message: string
}

const ErrorPage = ({ message }: ErrorPageProps) => (
	<div className={styles.root}>
		<h3 className={styles.title}>Uh oh!</h3>
		<p className={styles.message}>{message}</p>
	</div>
)

export default ErrorPage
