import { useState, useCallback } from 'react'
import { mutate } from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import Pal from 'models/Pal'
import { fetchVoid } from 'lib/fetch'
import handleError from 'lib/handleError'
import useReload from 'hooks/useReload'
import EditName from '../EditName'
import Email from '../Email'
import Spinner from 'components/Spinner'

import styles from './index.module.scss'

export interface ProfileDropdownContentProps {
	pal: Pal
}

const ProfileDropdownContent = ({ pal }: ProfileDropdownContentProps) => {
	const reload = useReload()
	const [isSignOutLoading, setIsSignOutLoading] = useState(false)

	const signOut = useCallback(async () => {
		try {
			setIsSignOutLoading(true)
			await fetchVoid('auth/sign-out', { method: 'POST' })

			mutate('auth', null)
			reload()
		} catch (error) {
			handleError(error)
		} finally {
			setIsSignOutLoading(false)
		}
	}, [reload, setIsSignOutLoading])

	return (
		<>
			<EditName pal={pal} />
			<Email pal={pal} />
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
