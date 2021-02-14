import { ReactNode, useState, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import Link from 'next/link'

import palState from 'state/pal'
import ProfileDropdown from './ProfileDropdown'
import LogInModal from 'components/Modal/LogIn'
import SignUpModal from 'components/Modal/SignUp'

import styles from './index.module.scss'

export interface NavbarProps {
	items?: ReactNode
}

const Navbar = ({ items }: NavbarProps) => {
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
