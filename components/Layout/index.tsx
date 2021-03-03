import { ReactNode } from 'react'
import cx from 'classnames'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

import styles from './index.module.scss'

export interface LayoutProps {
	className?: string
	navbar?: ReactNode
	children?: ReactNode
}

const Layout = ({ className, navbar, children }: LayoutProps) => (
	<div className={styles.root}>
		<Navbar items={navbar} />
		<Sidebar />
		<main className={cx(styles.main, className)}>{children}</main>
	</div>
)

export default Layout
