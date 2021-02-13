import { Router } from 'express'

import Pal from '../models/Pal'
import { getPens, getPen, createPen } from '../models/Pen'
import edit from '../models/Editor'
import sendError from '../utils/sendError'
import { assertAuthenticated } from '../utils/assert'
import pool from '../database'
import HttpError from '../utils/HttpError'

const router = Router()

router.options('/pens', (_req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
	next()
})

router.get('/pens', assertAuthenticated, async ({ user }, res) => {
	try {
		const client = await pool.connect()

		try {
			res.send(await getPens(client, user as Pal))
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 401)
	}
})

router.get('/pens/:id', async ({ params: { id } }, res) => {
	try {
		if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')
		const client = await pool.connect()

		try {
			res.send(await getPen(client, id))
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 500)
	}
})

router.ws('/pens/:id', async (socket, req) => {
	try {
		const { id } = req.params
		if (typeof id !== 'string' || req.isUnauthenticated()) return socket.close()

		await edit(id, socket)
	} catch {
		socket.close()
	}
})

router.post('/pens', assertAuthenticated, async ({ user }, res) => {
	try {
		const client = await pool.connect()

		try {
			res.send(await createPen(client, user as Pal))
		} finally {
			client.release()
		}
	} catch (error) {
		sendError(res, error, 401)
	}
})

export default router
