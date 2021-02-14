import { Router } from 'express'

import Pal from '../models/Pal'
import { canViewPen } from '../models/Pen'
import PenPal from '../models/PenPal'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import pool from '../database'

const router = Router()

router.get('/pens/:id/pals', async ({ params: { id }, user }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid pen')
		const client = await pool.connect()

		try {
			if (!(await canViewPen(client, user as Pal | undefined, id)))
				throw new HttpError(401, 'Unable to view this pen')

			const { rows: pals } = await client.query<PenPal, [string]>(
				'SELECT pals.id, pals.name, roles.role FROM pals JOIN roles ON roles.pal_id = pals.id WHERE roles.pen_id = $1',
				[id]
			)

			res.send(pals)
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 500)
	}
})

export default router
