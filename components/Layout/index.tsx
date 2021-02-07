import { ReactNode } from 'react'
import Head from 'next/head'

import styles from './index.module.scss'

export interface LayoutProps {
	title: string
	children?: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => (
	<div className={styles.root}>
		<Head>
			<title key="title">{title}</title>
		</Head>
		<Navbar />
		<Sidebar />
		<main className={styles.main}>{children}</main>
	</div>
)

export default Layout
