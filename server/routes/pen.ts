import { Router } from 'express'

import Pal from '../models/Pal'
import { getPens, createPen } from '../models/Pen'
import edit from '../models/Editor'
import sendError from '../utils/sendError'
import { assertAuthenticated } from '../utils/assert'

const router = Router()

router.options('/pens', (_req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
	next()
})

router.get('/pens', assertAuthenticated, async ({ user }, res) => {
	try {
		res.send(await getPens(user as Pal))
	} catch (error) {
		console.error(error)
		sendError(res, error, 401)
	}
})

router.ws('/pens/:id', async (socket, req) => {
	try {
		const { id } = req.params
		if (typeof id !== 'string' || req.isUnauthenticated()) return socket.close()

		await edit(id, socket)
	} catch (error) {
		console.error(error)
	}
})

router.post('/pens', assertAuthenticated, async ({ user }, res) => {
	try {
		res.send(await createPen(user as Pal))
	} catch (error) {
		console.error(error)
		sendError(res, error, 401)
	}
})

export default router