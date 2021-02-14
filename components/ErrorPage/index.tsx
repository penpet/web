import { NextPage } from 'next'

import Layout from 'components/Layout'
import ErrorMessage from 'components/Error'

export interface ErrorPageProps {
	status: number
}

const ErrorPage: NextPage<ErrorPageProps> = ({ status }) => (
	<Layout>
		<ErrorMessage>An unknown error occurred ({status})</ErrorMessage>
	</Layout>
)

ErrorPage.getInitialProps = async ({ res, err }) => ({
	status: res?.statusCode ?? err?.statusCode ?? 500
})

export default ErrorPage
