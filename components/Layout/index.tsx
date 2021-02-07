import { ReactNode } from 'react'

import User from 'models/User'
import Navbar from 'components/Navbar'
import Sidebar from 'components/Sidebar'

import styles from './index.module.scss'

export interface LayoutProps {
	user: User | null
	children?: ReactNode
}

const Layout = ({ user, children }: LayoutProps) => (
	<div className={styles.root}>
		<Navbar user={user} />
		<Sidebar />
		<main className={styles.main}>{children}</main>
	</div>
)

export default Layout
