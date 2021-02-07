import { useState, useCallback } from 'react'

import User from 'models/User'
import LogInModal from 'components/Modal/LogIn'
import SignUpModal from 'components/Modal/SignUp'

import styles from './index.module.scss'

export interface NavbarProps {
	user: User | null
}

const Navbar = ({ user }: NavbarProps) => {
	const [isLogInModalShowing, setIsLogInModalShowing] = useState(false)
	const [isSignUpModalShowing, setIsSignUpModalShowing] = useState(false)

	const showLogInModal = useCallback(() => {
		setIsLogInModalShowing(true)
	}, [setIsLogInModalShowing])

	const showSignUpModal = useCallback(() => {
		setIsSignUpModalShowing(true)
	}, [setIsSignUpModalShowing])

	return (
		<nav className={styles.root}>
			<h1 className={styles.title}>penpet</h1>
			{user ? (
				user.name
			) : (
				<>
					<button className={styles.logIn} onClick={showLogInModal}>
						Log in
					</button>
					<button className={styles.signUp} onClick={showSignUpModal}>
						Sign up
					</button>
					<LogInModal
						isShowing={isLogInModalShowing}
						setIsShowing={setIsLogInModalShowing}
					/>
					<SignUpModal
						isShowing={isSignUpModalShowing}
						setIsShowing={setIsSignUpModalShowing}
					/>
				</>
			)}
		</nav>
	)
}

export default Navbar
