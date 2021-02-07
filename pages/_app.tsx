import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'

import Layout from 'components/Layout'

import 'styles/global.scss'

config.autoAddCss = false

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
	<Layout>
		<Component {...pageProps} />
	</Layout>
)

export default App
