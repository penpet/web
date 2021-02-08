import App, { AppProps, AppContext } from 'next/app'
import { RecoilRoot } from 'recoil'
import { config } from '@fortawesome/fontawesome-svg-core'

import getPal from 'lib/getPal'
import initializeState from 'state'
import Layout from 'components/Layout'

import 'styles/global.scss'

config.autoAddCss = false

const CustomApp = ({ Component, pageProps }: AppProps) => (
	<RecoilRoot initializeState={initializeState(pageProps)}>
		<Layout>
			<Component {...pageProps} />
		</Layout>
	</RecoilRoot>
)

CustomApp.getInitialProps = async (context: AppContext) => {
	const [{ pageProps }, pal] = await Promise.all([
		App.getInitialProps(context),
		getPal(context.ctx)
	])

	return {
		pageProps: { ...pageProps, pal }
	}
}

export default CustomApp
