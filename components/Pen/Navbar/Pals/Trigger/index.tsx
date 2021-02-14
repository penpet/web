import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './index.module.scss'

const PenPagePalsTrigger = () => (
	<>
		<FontAwesomeIcon className={styles.icon} icon={faUsers} />
		Pals
	</>
)

export default PenPagePalsTrigger
export const triggerClassName = styles.root
