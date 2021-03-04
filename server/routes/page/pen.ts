import { Router } from 'express'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { encode } from 'html-entities'

import getPreview, { Delta } from '../../models/Preview'
import HttpError from '../../utils/HttpError'
import sendError from '../../utils/sendError'
import { useClient } from '../../database'

interface Snapshot {
	name: string
	data: Delta
}

const router = Router()

router.get('/:id', async ({ params: { id } }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

		const { rows: pens } = await useClient(client =>
			client.query<Snapshot, [string]>(
				`
				SELECT pens.name, snapshots.data
				FROM pens
				JOIN snapshots ON snapshots.id = pens.id
				WHERE pens.id = $1
				`,
				[id]
			)
		)

		const pen = pens[0]
		if (!pen) throw new HttpError(404, 'Pen not found')

		res.send(`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<meta name="description" content="${encode(getPreview(pen.data))}">
					<title>${encode(pen.name)}</title>
				</head>
				<body>
					${new QuillDeltaToHtmlConverter(pen.data.ops).convert()}
				</body>
			</html>
		`)
	} catch (error) {
		sendError(res, error, 500)
	}
})

export default router
