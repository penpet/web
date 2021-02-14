import usePens from 'hooks/usePens'
import Pen from './Pen'

import styles from './index.module.scss'

const SidebarPens = () => {
	const pens = usePens()

	return (
		<div className={styles.root}>
			{pens.map(pen => (
				<Pen key={pen.id} pen={pen} />
			))}
		</div>
	)
}

export default SidebarPens
