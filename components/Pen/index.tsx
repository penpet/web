import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { PenData } from 'models/Pen'
import PenQuery from 'models/PenQuery'
import HttpError from 'models/HttpError'
import getPen from 'lib/getPen'
import Editor from 'components/Editor'
import ErrorPage from 'components/Error'

const getErrorMessage = (status: number) => {
	switch (status) {
		case 404:
			return "This pen doesn't exist"
		default:
			return 'An unknown error occurred'
	}
}

interface PenPageProps {
	pen: PenData | number
}

const PenPage: NextPage<PenPageProps> = ({ pen }) => {
	const { id } = useRouter().query as PenQuery

	return typeof pen === 'object' ? (
		<Editor penId={id} />
	) : (
		<ErrorPage message={getErrorMessage(pen)} />
	)
}

PenPage.getInitialProps = async ({ query: { id }, res }) => {
	try {
		if (typeof id !== 'string') throw new HttpError(404, 'Invalid ID')

		return { pen: await getPen(id) }
	} catch (error) {
		const status = error instanceof HttpError ? error.status : 500
		if (res) res.statusCode = status

		return { pen: status }
	}
}

export default PenPage
