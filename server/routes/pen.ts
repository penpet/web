import { Router } from 'express'

import Pal from '../models/Pal'
import { getPens, createPen } from '../models/Pen'
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
		sendError(res, error, 401)
	}
})

router.post('/pens', assertAuthenticated, async ({ user }, res) => {
	try {
		res.send(await createPen(user as Pal))
	} catch (error) {
		sendError(res, error, 401)
	}
})

export default router
