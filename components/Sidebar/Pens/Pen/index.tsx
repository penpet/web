import { useRouter } from 'next/router'
import Link from 'next/link'

import Pen from 'models/Pen'
import formatTimeAgo from 'lib/formatTimeAgo'

import styles from './index.module.scss'

export interface SidebarPenProps {
	pen: Pen
}

const SidebarPen = ({ pen }: SidebarPenProps) => {
	const { id } = useRouter().query

	return (
		<Link href={`/${pen.id}`}>
			<a className={styles.root} aria-current={pen.id === id && 'page'}>
				<span className={styles.name}>{pen.name}</span>
				<span className={styles.info}>
					<span>{formatTimeAgo(pen.updated)}</span>
					<span>{pen.role}</span>
				</span>
			</a>
		</Link>
	)
}

export default SidebarPen
