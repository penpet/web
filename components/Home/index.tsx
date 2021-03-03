import { NextPage } from 'next'

import Layout from 'components/Layout'
import Head from 'components/Head'

import styles from './index.module.scss'

const Home: NextPage = () => (
	<Layout className={styles.root}>
		<Head
			title="penpet: The ultimate collaborative editor"
			description="Invite your pals and create pens that hundreds of people can write on at once"
		/>
		<h1 className={styles.title}>The ultimate collaborative editor</h1>
		<p className={styles.description}>
			Invite your pals and create pens that <em>hundreds</em> of people can
			write on at once
		</p>
	</Layout>
)

export default Home
