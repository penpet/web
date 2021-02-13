import { NextPage } from 'next'

import ErrorPage from 'components/Error'

const NotFound: NextPage = () => (
	<ErrorPage message="There's nothing at this URL" />
)

export default NotFound
