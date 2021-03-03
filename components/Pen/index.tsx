import { useMemo, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { PenData, penFromData } from 'models/Pen'
import PenQuery from 'models/PenQuery'
import ActivePal from 'models/ActivePal'
import HttpError from 'models/HttpError'
import getError, { UNKNOWN_ERROR } from './error'
import getPen from 'lib/getPen'
import usePen from 'hooks/usePen'
import Layout from 'components/Layout'
import Navbar from './Navbar'
import Head from 'components/Head'
import Editor from 'components/Editor'
import ErrorMessage from 'components/Error'

interface PenPageProps {
	pen: PenData | number
}

const PenPage: NextPage<PenPageProps> = ({ pen: initialPenData }) => {
	const [activePals, setActivePals] = useState<ActivePal[] | null>(null)

	const { pen: id } = useRouter().query as PenQuery
	const penData = usePen(id) ?? initialPenData

	const pen = useMemo(
		() => (typeof penData === 'object' ? penFromData(penData) : null),
		[penData]
	)

	const error = typeof penData === 'number' ? getError(penData) : null

	return (
		<Layout navbar={pen && <Navbar pen={pen} activePals={activePals} />}>
			<Head
				title={`${pen?.name ?? (error ?? UNKNOWN_ERROR).title} | penpet`}
				description={pen?.name ?? (error ?? UNKNOWN_ERROR).description}
			/>
			{pen ? (
				<Editor pen={pen} setActivePals={setActivePals} />
			) : (
				<ErrorMessage>{(error ?? UNKNOWN_ERROR).message}</ErrorMessage>
			)}
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
