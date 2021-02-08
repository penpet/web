import { ReactNode } from 'react'

import Navbar from 'components/Navbar'
import Sidebar from 'components/Sidebar'

import styles from './index.module.scss'

export interface LayoutProps {
	children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
	<div className={styles.root}>
		<Navbar />
		<Sidebar />
		<main className={styles.main}>{children}</main>
	</div>
)

export default Layout
