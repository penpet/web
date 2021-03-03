import { useRouter } from 'next/router'
import NextHead from 'next/head'

import { ORIGIN } from 'lib/constants'

export interface HeadProps {
	title: string
	description: string
	storagePreconnect?: boolean
}

const Head = ({ title, description }: HeadProps) => {
	const router = useRouter()
	const url = `${ORIGIN}${router.asPath}`

	return (
		<NextHead>
			<link key="canonical" rel="canonical" href={url} />
			<meta key="description" name="description" content={description} />
			<meta key="og-url" property="og:url" content={url} />
			<meta key="og-title" property="og:title" content={title} />
			<meta
				key="og-description"
				property="og:description"
				content={description}
			/>
			<meta key="twitter-title" name="twitter:title" content={title} />
			<meta
				key="twitter-description"
				name="twitter:description"
				content={description}
			/>
			<title key="title">{title}</title>
		</NextHead>
	)
}

export default Head
