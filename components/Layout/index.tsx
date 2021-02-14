import { ReactNode } from 'react'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

import styles from './index.module.scss'

export interface LayoutProps {
	navbar?: ReactNode
	children?: ReactNode
}

const Layout = ({ navbar, children }: LayoutProps) => (
	<div className={styles.root}>
		<Navbar items={navbar} />
		<Sidebar />
		<main className={styles.main}>{children}</main>
	</div>
)

export default Layout
