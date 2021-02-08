import { useState, useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import palState from 'state/pal'
import LogInModal from 'components/Modal/LogIn'
import SignUpModal from 'components/Modal/SignUp'

import styles from './index.module.scss'

const Navbar = () => {
	const pal = useRecoilValue(palState)

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
			{pal ? (
				pal.name
			) : (
				<>
					<button className={styles.logIn} onClick={showLogInModal}>
						Log in
					</button>
					<button className={styles.signUp} onClick={showSignUpModal}>
						Sign up
					</button>
				</>
			)}
			<LogInModal
				isShowing={isLogInModalShowing}
				setIsShowing={setIsLogInModalShowing}
			/>
			<SignUpModal
				isShowing={isSignUpModalShowing}
				setIsShowing={setIsSignUpModalShowing}
			/>
		</nav>
	)
}

export default Navbar
