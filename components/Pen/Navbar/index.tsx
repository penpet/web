import Pen from 'models/Pen'
import Pals from './Pals'

import styles from './index.module.scss'

export interface PenPageNavbarProps {
	pen: Pen
}

const PenPageNavbar = ({ pen }: PenPageNavbarProps) => (
	<>
		<p className={styles.name}>{pen.name}</p>
		<Pals pen={pen} />
	</>
)

export default PenPageNavbar
