import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import { getPenPals } from '../models/PenPal'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import pool from '../database'

const router = Router()

router.get(
	'/pens/:id/pals',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	async ({ params: { id }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid pen')
			const client = await pool.connect()

			try {
				res.send(await getPenPals(client, user as Pal | undefined, id))
			} finally {
				client.release()
			}
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
