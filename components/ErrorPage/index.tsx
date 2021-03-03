import { NextPage } from 'next'

import Layout from 'components/Layout'
import Head from 'components/Head'
import ErrorMessage from 'components/Error'

export interface ErrorPageProps {
	status: number
}

const ErrorPage: NextPage<ErrorPageProps> = ({ status }) => (
	<Layout>
		<Head
			title={`Error (${status}) | penpet`}
			description={`An unknown error occurred (${status})`}
		/>
		<ErrorMessage>An unknown error occurred ({status})</ErrorMessage>
	</Layout>
)

ErrorPage.getInitialProps = async ({ res, err }) => ({
	status: res?.statusCode ?? err?.statusCode ?? 500
})

export default ErrorPage
