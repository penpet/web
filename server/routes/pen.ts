import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import {
	getPens,
	getPen,
	createPen,
	editPenName,
	deletePen
} from '../models/Pen'
import { getRole } from '../models/Role'
import edit from '../models/Editor'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import { assertAuthenticated } from '../utils/assert'
import { useClient } from '../database'

const router = Router()

router.get(
	'/pens',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	assertAuthenticated,
	async ({ user }, res) => {
		try {
			res.send(await useClient(client => getPens(client, user as Pal)))
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

			const pen = await useClient(client =>
				getPen(client, user as Pal | undefined, id)
			)

			res.send(pen)
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.ws('/pens/:id', async (socket, { params: { id }, user }) => {
	try {
		if (typeof id !== 'string') throw new Error('Invalid ID')

		const role = await useClient(client =>
			getRole(client, (user as Pal | undefined)?.id, id)
		)
		if (!role) throw new Error('Private pen')

		await edit(socket, id, role)

		const ping = setInterval(() => {
			socket.ping()
		}, 5000)

		socket.on('close', () => {
			clearInterval(ping)
		})
	} catch (error) {
		const { readyState, CONNECTING, OPEN } = socket
		if (readyState === CONNECTING || readyState === OPEN) socket.close()
	}
})

router.post(
	'/pens',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	async ({ user }, res) => {
		try {
			res.send(await useClient(client => createPen(client, user as Pal)))
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
	async ({ params: { id }, headers, body, user }, res) => {
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

			const { name } = body as { name: unknown }

			if (typeof name !== 'string') throw new HttpError(400, 'Invalid body')
			if (!name) throw new HttpError(400, 'Invalid name')

			await useClient(async client => {
				await editPenName(client, user as Pal, id, name)
			})

			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.delete(
	'/pens/:id',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	async ({ params: { id }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

			await useClient(async client => {
				await deletePen(client, user as Pal, id)
			})

			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
