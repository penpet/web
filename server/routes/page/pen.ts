import { Router } from 'express'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { encode } from 'html-entities'

import { PublicRole } from '../../models/Role'
import getPreview, { Delta } from '../../models/Preview'
import page from '../../models/Page'
import ErrorDescription, {
	getUnknownError,
	UNKNOWN_ERROR_STATUS
} from '../../models/ErrorDescription'
import HttpError from '../../utils/HttpError'
import { useClient } from '../../database'

interface Snapshot {
	name: string
	role: PublicRole | null
	data: Delta
}

const getError = (status: number): ErrorDescription => {
	switch (status) {
		case 401:
			return {
				title: 'Private pen',
				description: 'This pen is private',
				message: 'This pen is private'
			}
		case 404:
			return {
				title: '404',
				description: "This pen doesn't exist",
				message: "This pen doesn't exist"
			}
		default:
			return getUnknownError(status)
	}
}

const router = Router()

router.get('/:id', async ({ params: { id } }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

		const pen = await useClient(async client => {
			const { rows: pens } = await client.query<Snapshot, [string]>(
				`
				SELECT
					pens.name,
					pens.role,
					snapshots.data
				FROM pens
				JOIN snapshots ON snapshots.id = pens.id
				WHERE pens.id = $1
				`,
				[id]
			)

			const pen = pens[0]

			if (!pen) throw new HttpError(404, 'Pen not found')
			if (!pen.role) throw new HttpError(401, 'Private pen')

			return pen
		})

		res.send(
			page({
				id: 'pen',
				title: pen.name,
				description: getPreview(pen.data),
				body: new QuillDeltaToHtmlConverter(pen.data.ops).convert()
			})
		)
	} catch (error) {
		const status =
			error instanceof HttpError ? error.status : UNKNOWN_ERROR_STATUS

		const { title, description, message } = getError(status)

		res.status(status).send(
			page({
				id: 'error',
				title,
				description,
				body: `
					<h1 id="title">Uh oh!</h1>
					<p id="message">${encode(message)}</p>
				`
			})
		)
	}
})

export default router
