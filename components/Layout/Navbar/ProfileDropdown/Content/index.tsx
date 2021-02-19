import { useState, useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { fetchVoid } from 'lib/fetch'
import handleError from 'lib/handleError'
import palState from 'state/pal'
import useReload from 'hooks/useReload'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

const ProfileDropdownContent = () => {
	const reload = useReload()

	const setPal = useSetRecoilState(palState)
	const [isSignOutLoading, setIsSignOutLoading] = useState(false)

	const signOut = useCallback(async () => {
		try {
			setIsSignOutLoading(true)
			await fetchVoid('auth/sign-out', { method: 'POST' })

			setPal(null)
			reload()
		} catch (error) {
			handleError(error)
		} finally {
			setIsSignOutLoading(false)
		}
	}, [reload, setPal, setIsSignOutLoading])

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
