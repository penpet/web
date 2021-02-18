import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { logInModalState, signUpModalState } from 'state/authModal'

import styles from './index.module.scss'

const InviteAuth = () => {
	const setIsLogInModalShowing = useSetRecoilState(logInModalState)
	const setIsSignUpModalShowing = useSetRecoilState(signUpModalState)

	const showLogInModal = useCallback(() => {
		setIsLogInModalShowing(true)
	}, [setIsLogInModalShowing])

	const showSignUpModal = useCallback(() => {
		setIsSignUpModalShowing(true)
	}, [setIsSignUpModalShowing])

	return (
		<div className={styles.root}>
			<h3 className={styles.title}>Accept invite</h3>
			<div className={styles.actions}>
				<button className={styles.logIn} onClick={showLogInModal}>
					log in
				</button>
				<button className={styles.signUp} onClick={showSignUpModal}>
					sign up
				</button>
			</div>
		</div>
	)
}

export default InviteAuth
