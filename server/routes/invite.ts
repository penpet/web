import { Router } from 'express'

import Pal from '../models/Pal'
import { getInvite, acceptInvite } from '../models/Invite'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import pool from '../database'

const router = Router()

router.post('/invites/:id', async ({ params: { id }, user }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')
		const client = await pool.connect()

		try {
			const invite = await getInvite(client, id)
			if (!user) return res.status(401).send(invite)

			res.send(await acceptInvite(client, user as Pal, invite))
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 500)
	}
})

export default router
