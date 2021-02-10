import { useState, useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { fetchVoid } from 'lib/fetch'
import palState from 'state/pal'

import styles from './index.module.scss'
import Spinner from 'components/Spinner'

const ProfileDropdownContent = () => {
	const setPal = useSetRecoilState(palState)
	const [isSignOutLoading, setIsSignOutLoading] = useState(false)

	const signOut = useCallback(async () => {
		try {
			setIsSignOutLoading(true)
			await fetchVoid('auth/sign-out', { method: 'POST' })

			setPal(null)
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'An unknown error occurred'
			)
		} finally {
			setIsSignOutLoading(false)
		}
	}, [setPal, setIsSignOutLoading])

	return (
		<>
			<button
				className={styles.signOut}
				disabled={isSignOutLoading}
				onClick={signOut}
			>
				{isSignOutLoading ? (
					<Spinner className={styles.signOutSpinner} />
				) : (
					<FontAwesomeIcon className={styles.signOutIcon} icon={faSignOutAlt} />
				)}
				sign out
			</button>
		</>
	)
}

export default ProfileDropdownContent
export const contentClassName = styles.root
