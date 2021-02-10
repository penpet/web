import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Pal from 'models/Pal'

import styles from './index.module.scss'

export interface ProfileDropdownTriggerProps {
	pal: Pal
}

const ProfileDropdownTrigger = ({ pal }: ProfileDropdownTriggerProps) => (
	<>
		{pal.name}
		<FontAwesomeIcon className={styles.icon} icon={faChevronDown} />
	</>
)

export default ProfileDropdownTrigger
export const triggerClassName = styles.root
