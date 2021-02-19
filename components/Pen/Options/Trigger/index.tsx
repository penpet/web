import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import styles from './index.module.scss'

const PenOptionsTrigger = () => <FontAwesomeIcon icon={faEllipsisH} />

export default PenOptionsTrigger
export const triggerClassName = styles.root
