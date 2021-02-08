import CreatePet from './CreatePet'

import styles from './index.module.scss'

const Sidebar = () => {
	return (
		<aside className={styles.root}>
			<CreatePet />
			<div className={styles.pets} />
		</aside>
	)
}

export default Sidebar
