import usePens from 'hooks/usePens'

import styles from './index.module.scss'

const SidebarPens = () => {
	const pens = usePens()

	return (
		<div className={styles.root}>
			{pens.map(pen => (
				<p key={pen.id}>{pen.name}</p>
			))}
		</div>
	)
}

export default SidebarPens
