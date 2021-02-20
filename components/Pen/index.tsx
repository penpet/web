import { useMemo } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { PenData, penFromData } from 'models/Pen'
import PenQuery from 'models/PenQuery'
import HttpError from 'models/HttpError'
import getPen from 'lib/getPen'
import { ORIGIN } from 'lib/constants'
import usePen from 'hooks/usePen'
import Layout from 'components/Layout'
import Navbar from './Navbar'
import Head from 'components/Head'
import Editor from 'components/Editor'
import ErrorMessage from 'components/Error'

const getErrorMessage = (status: number) => {
	switch (status) {
		case 401:
			return 'This pen is private'
		case 404:
			return "This pen doesn't exist"
		default:
			return 'An unknown error occurred'
	}
}

interface PenPageProps {
	pen: PenData | number
}

const PenPage: NextPage<PenPageProps> = ({ pen: initialPenData }) => {
	const { pen: id } = useRouter().query as PenQuery
	const penData = usePen(id) ?? initialPenData

	const pen = useMemo(
		() => (typeof penData === 'object' ? penFromData(penData) : null),
		[penData]
	)

	const errorMessage =
		typeof penData === 'number' ? getErrorMessage(penData) : null

	return (
		<Layout navbar={pen && <Navbar pen={pen} />}>
			<Head
				url={`${ORIGIN}${useRouter().asPath}`}
				title={`${pen?.name ?? errorMessage} | penpet`}
				description="" // TODO: Add description
			/>
			{pen && <Editor id={pen.id} />}
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
		</Layout>
	)
}

PenPage.getInitialProps = async context => {
	try {
		const { pen: id } = context.query
		if (typeof id !== 'string') throw new HttpError(404, 'Invalid ID')

		return { pen: await getPen(context, id) }
	} catch (error) {
		const status = error instanceof HttpError ? error.status : 500

		const { res } = context
		if (res) res.statusCode = status

		return { pen: status }
	}
}

export default PenPage
