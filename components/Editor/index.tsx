import Toolbar from './Toolbar'
import Content from './Content'

import styles from './index.module.scss'

const Editor = () => {
	return (
		<div className={styles.root}>
			<Toolbar />
			<Content />
		</div>
	)
}

export default Editor
