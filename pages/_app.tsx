import App, { AppProps, AppContext } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'

import getUser from 'lib/getUser'
import Layout from 'components/Layout'

import 'styles/global.scss'

config.autoAddCss = false

const CustomApp = ({ Component, pageProps }: AppProps) => (
	<Layout user={pageProps.user}>
		<Component {...pageProps} />
	</Layout>
)

CustomApp.getInitialProps = async (context: AppContext) => {
	const [{ pageProps }, user] = await Promise.all([
		App.getInitialProps(context),
		getUser(context.ctx)
	])

	return {
		pageProps: { ...pageProps, user }
	}
}

export default CustomApp
