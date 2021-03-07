import { encode } from 'html-entities'

export interface PageOptions {
	id: string
	title: string
	description: string
	body: string
}

const page = ({ id, title, description, body }: PageOptions) => `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="description" content="${encode(description)}">
			<link rel="preload" href="https://pen.pet/fonts/OperatorMono.otf" as="font" type="font/otf" crossorigin="anonymous">
			<link rel="preload" href="/styles/${id}.css" as="style">
			<link rel="stylesheet" href="/styles/${id}.css">
			<title>${encode(title)}</title>
		</head>
		<body>${body}</body>
	</html>
`

export default page
