import Document, { Html, Head, Main, NextScript } from 'next/document'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
if (!googleClientId) throw new Error('Missing Google client ID')

export default class CustomDocument extends Document {
	render = () => (
		<Html lang="en">
			<Head />
			<body>
				<div
					id="g_id_onload"
					data-client_id={googleClientId}
					data-login_uri="https://pen.pet"
				/>
				<Main />
				<NextScript />
				<script src="https://accounts.google.com/gsi/client" async />
			</body>
		</Html>
	)
}
