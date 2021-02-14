import { Router } from 'express'

import Pal from '../models/Pal'
import { getPen } from '../models/Pen'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import pool from '../database'

const router = Router()

router.get('/pens/:id/pals', async ({ params: { id }, user }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid pen')

		const client = await pool.connect()

		try {
			const pen = await getPen(client, user as Pal, id)
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 500)
	}
})

export default router
