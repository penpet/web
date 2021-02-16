import { Router } from 'express'
import rateLimit from 'express-rate-limit'

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

router.get(
	'/pens',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	assertAuthenticated,
	async ({ user }, res) => {
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
	}
)

router.get(
	'/pens/:id',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	async ({ params: { id }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')
			const client = await pool.connect()

			try {
				res.send(await getPen(client, user as Pal | undefined, id))
			} finally {
				client.release()
			}
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.ws('/pens/:id', async (socket, req) => {
	try {
		const { id } = req.params

		if (typeof id !== 'string' || req.isUnauthenticated())
			throw new Error('Bad request')

		await edit(id, socket)

		const ping = setInterval(() => {
			socket.ping()
		}, 5000)

		socket.on('close', () => {
			clearInterval(ping)
		})
	} catch {
		socket.close()
	}
})

router.post(
	'/pens',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	async ({ user }, res) => {
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
	}
)

export default router
