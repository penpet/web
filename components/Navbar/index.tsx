import styles from './index.module.scss'

const Navbar = () => (
	<nav className={styles.root}>
		<h1 className={styles.title}>penpet</h1>
		<button className={styles.logIn}>Log in</button>
		<button className={styles.signUp}>Sign up</button>
	</nav>
)

export default Navbar
