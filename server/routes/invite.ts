import { Router } from 'express'

import Pal from '../models/Pal'
import { getInvite, acceptInvite } from '../models/Invite'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import { useClient } from '../database'

const router = Router()

router.post('/invites/:id', async ({ params: { id }, user }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

		await useClient(async client => {
			const invite = await getInvite(client, id)

			user
				? res.send(await acceptInvite(client, user as Pal, invite))
				: res.status(401).send(invite)
		})
	} catch (error) {
		sendError(res, error, 500)
	}
})

export default router
