import App, { AppProps, AppContext } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'

import getInitialState from 'lib/getInitialState'
import initializeState from 'state'
import Layout from 'components/Layout'

import 'styles/global.scss'

config.autoAddCss = false

const CustomApp = ({ Component, pageProps }: AppProps) => (
	<RecoilRoot initializeState={initializeState(pageProps)}>
		<Layout>
			<Component {...pageProps} />
		</Layout>
		<ToastContainer />
	</RecoilRoot>
)

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
