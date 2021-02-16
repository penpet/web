import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import { assertAuthenticated } from '../utils/assert'
import HttpError from '../utils/HttpError'
import getSignedUrl from '../utils/getSignedUrl'
import sendError from '../utils/sendError'

const router = Router()

router.get(
	'/signed',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	async ({ user, headers, query: { name } }, res) => {
		try {
			const type = headers['content-type']

			if (typeof name !== 'string') throw new HttpError(400, 'Invalid name')
			if (typeof type !== 'string') throw new HttpError(400, 'Invalid type')

			res.send(await getSignedUrl(user as Pal, name, type))
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
