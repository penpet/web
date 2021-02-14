import { NextPage } from 'next'

import Layout from 'components/Layout'
import ErrorMessage from 'components/Error'

const NotFound: NextPage = () => (
	<Layout>
		<ErrorMessage>There's nothing at this URL</ErrorMessage>
	</Layout>
)

export default NotFound
