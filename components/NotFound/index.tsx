import { NextPage } from 'next'

import Layout from 'components/Layout'
import Head from 'components/Head'
import ErrorMessage from 'components/Error'

const NotFound: NextPage = () => (
	<Layout>
		<Head title="404 | penpet" description="There's nothing here" />
		<ErrorMessage>There's nothing here</ErrorMessage>
	</Layout>
)

export default NotFound
