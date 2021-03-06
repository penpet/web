import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../../models/Pal'
import { assertAuthenticated } from '../../middleware/assert'
import HttpError from '../../utils/HttpError'
import upload from '../../utils/upload'
import sendError from '../../utils/sendError'

const router = Router()

router.post(
	'/upload',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	express.json(),
	async ({ headers, body, user }, res) => {
		try {
			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { name, type } = body as {
				name: unknown
				type: unknown
			}

			if (!(typeof name === 'string' && typeof type === 'string'))
				throw new HttpError(400, 'Invalid body')

			res.send(await upload(user as Pal, body))
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
