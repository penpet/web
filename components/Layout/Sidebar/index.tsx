import CreatePen from './CreatePen'
import Search from './Search'
import Pens from './Pens'

import styles from './index.module.scss'

const Sidebar = () => {
	return (
		<aside className={styles.root}>
			<CreatePen />
			<Search />
			<Pens />
		</aside>
	)
}

export default Sidebar
