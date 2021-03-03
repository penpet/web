import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import Invite from 'models/Invite'
import Role from 'models/Role'
import { logInModalState, signUpModalState } from 'state/authModal'
import Head from 'components/Head'

import styles from './index.module.scss'

export interface InviteAuthProps {
	invite: Invite
}

const InviteAuth = ({ invite }: InviteAuthProps) => {
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
			<Head
				title={`${invite.role === Role.Viewer ? 'View' : 'Edit'} ${
					invite.pen_name
				} | penpet`}
				description={`You've been invited to ${
					invite.role === Role.Viewer ? 'view' : 'edit'
				} ${invite.pen_name}`}
			/>
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
