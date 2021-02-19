import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import queryPens from 'lib/queryPens'
import queryState from 'state/query'
import usePens from 'hooks/usePens'
import Pen from './Pen'

import styles from './index.module.scss'

const SidebarPens = () => {
	const query = useRecoilValue(queryState)

	const allPens = usePens()
	const pens = useMemo(() => allPens.filter(queryPens(query)), [allPens, query])

	return (
		<div className={styles.root}>
			{pens.map(pen => (
				<Pen key={pen.id} pen={pen} />
			))}
		</div>
	)
}

export default SidebarPens
