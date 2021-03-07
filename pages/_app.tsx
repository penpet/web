import App, { AppProps, AppContext } from 'next/app'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'

import getInitialState from 'lib/getInitialState'
import initializeState from 'state'
import useProgress from 'hooks/useProgress'
import LogInModal from 'components/Modal/LogIn'
import SignUpModal from 'components/Modal/SignUp'

import styles from 'components/App/index.module.scss'

import 'components/App/index.scss'
import 'components/Progress/index.scss'

config.autoAddCss = false

const CustomApp = ({ Component, pageProps }: AppProps) => {
	useProgress()

	return (
		<>
			<Head>
				<meta key="og-site-name" property="og:site_name" content="penpet" />
				<meta key="og-type" property="og:type" content="website" />
				<meta
					key="twitter-card"
					name="twitter:card"
					content="summary_large_image"
				/>
				<meta key="twitter-site" name="twitter:site" content="@penpet" />
				<meta key="twitter-creator" name="twitter:creator" content="@penpet" />
				<meta key="twitter-domain" name="twitter:domain" content="pen.pet" />
				<meta
					key="msapplication-tilecolor"
					name="msapplication-TileColor"
					content={styles.theme}
				/>
				<meta key="theme-color" name="theme-color" content={styles.theme} />
				<link
					rel="preload"
					href="/fonts/OperatorMono.otf"
					as="font"
					type="font/otf"
					crossOrigin="anonymous"
				/>
			</Head>
			<RecoilRoot initializeState={initializeState(pageProps)}>
				<Component {...pageProps} />
				<LogInModal />
				<SignUpModal />
				<ToastContainer />
			</RecoilRoot>
		</>
	)
}

CustomApp.getInitialProps = async (context: AppContext) => {
	const [{ pageProps: props }, state] = await Promise.all([
		App.getInitialProps(context),
		getInitialState(context.ctx)
	])

	return {
		pageProps: { ...props, ...state }
	}
}

export default CustomApp
