import Spinner from 'components/Spinner'

import styles from './index.module.scss'

const EditorLoader = () => (
	<div className={styles.root}>
		<Spinner className={styles.spinner} />
	</div>
)

export default EditorLoader
