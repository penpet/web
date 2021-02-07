import { NextPage } from 'next'
import { AppProps } from 'next/app'

import Layout from 'components/Layout'

import 'styles/global.scss'

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
	<Layout>
		<Component {...pageProps} />
	</Layout>
)

export default App
