import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import { getPens, getPen, createPen, editPenName } from '../models/Pen'
import { getRole } from '../models/Role'
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

router.ws('/pens/:id', async (socket, { params: { id }, user }) => {
	try {
		if (typeof id !== 'string') throw new Error('Invalid ID')
		const client = await pool.connect()

		try {
			if (!(await getRole(client, user as Pal | undefined, id)))
				throw new Error('Private pen')
		} finally {
			client.release()
		}

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

router.patch(
	'/pens/:id',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	express.json(),
	async ({ query: { id }, headers, body, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { name } = body

			if (typeof name !== 'string') throw new HttpError(400, 'Invalid body')
			if (!name) throw new HttpError(400, 'Invalid name')

			const client = await pool.connect()

			try {
				await editPenName(client, user as Pal, id, name)
				res.send()
			} finally {
				client.release()
			}
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
