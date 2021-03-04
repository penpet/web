import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../../models/Pal'
import { deleteOwnRole } from '../../models/Role'
import { assertAuthenticated } from '../../middleware/assert'
import HttpError from '../../utils/HttpError'
import sendError from '../../utils/sendError'
import { useClient } from '../../database'

const router = Router()

router.delete(
	'/roles/:id',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	async ({ params: { id }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

			await useClient(async client => {
				await deleteOwnRole(client, user as Pal, id)
			})

			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
