import { ReactNode, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Link from 'next/link'

import palState from 'state/pal'
import { logInModalState, signUpModalState } from 'state/authModal'
import ProfileDropdown from './ProfileDropdown'

import styles from './index.module.scss'

export interface NavbarProps {
	items?: ReactNode
}

const Navbar = ({ items }: NavbarProps) => {
	const pal = useRecoilValue(palState)

	const setIsLogInModalShowing = useSetRecoilState(logInModalState)
	const setIsSignUpModalShowing = useSetRecoilState(signUpModalState)

	const showLogInModal = useCallback(() => {
		setIsLogInModalShowing(true)
	}, [setIsLogInModalShowing])

	const showSignUpModal = useCallback(() => {
		setIsSignUpModalShowing(true)
	}, [setIsSignUpModalShowing])

	return (
		<nav className={styles.root}>
			<Link href="/">
				<a className={styles.title}>penpet</a>
			</Link>
			<div className={styles.items}>{items}</div>
			{pal ? (
				<ProfileDropdown pal={pal} />
			) : (
				<>
					<button className={styles.logIn} onClick={showLogInModal}>
						log in
					</button>
					<button className={styles.signUp} onClick={showSignUpModal}>
						sign up
					</button>
				</>
			)}
		</nav>
	)
}

export default Navbar
