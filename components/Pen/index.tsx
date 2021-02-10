import { NextPage } from 'next'
import { useRouter } from 'next/router'

import PenQuery from 'models/PenQuery'
import Editor from 'components/Editor'

const PenPage: NextPage = () => {
	const { id } = useRouter().query as PenQuery

	return <Editor penId={id} />
}

export default PenPage
