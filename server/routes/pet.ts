import { Router } from 'express'

import Pal from '../models/Pal'
import { createPet } from '../models/Pet'
import HttpError from '../utils/HttpError'
import { assertAuthenticated } from '../utils/assert'

const router = Router()

router.options('/pets', (_req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'OPTIONS, POST')
	next()
})

router.post('/pets', assertAuthenticated, async ({ user }, res) => {
	try {
		res.send(await createPet(user as Pal))
	} catch (error) {
		res
			.status(error instanceof HttpError ? error.status : 401)
			.send(error instanceof Error ? error.message : error)
	}
})

export default router
