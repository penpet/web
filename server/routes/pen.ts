import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import {
	getPens,
	getPen,
	createPen,
	editPenName,
	editPublicRole,
	deletePen
} from '../models/Pen'
import { PublicRole, getRole } from '../models/Role'
import edit from '../models/Editor'
import Cursors from '../models/Cursors'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import { assertAuthenticated } from '../utils/assert'
import { isOpen, ping } from '../utils/socket'
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
	async ({ params: { id }, query: { preview }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid ID')

			const pen = await useClient(client =>
				getPen(client, user as Pal | undefined, id, preview === '1')
			)

			res.send(pen)
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.ws('/pens/:id', async (socket, { params: { id: penId }, user }) => {
	try {
		if (typeof penId !== 'string') throw new Error('Invalid ID')

		const role = await useClient(client =>
			getRole(client, (user as Pal | undefined)?.id, penId)
		)
		if (!role) throw new Error('Private pen')

		await edit(socket, penId, role)

		ping(socket)
	} catch {
		if (isOpen(socket)) socket.close()
	}
})

router.ws(
	'/pens/:id/cursors',
	async (socket, { params: { id: penId }, user }) => {
		try {
			if (typeof penId !== 'string') throw new Error('Invalid ID')

			const role = await useClient(client =>
				getRole(client, (user as Pal | undefined)?.id, penId)
			)
			if (!role) throw new Error('Private pen')

			const cursors = new Cursors(penId)

			cursors.subscribe(socket, user as Pal | undefined)
			ping(socket)
		} catch {
			if (isOpen(socket)) socket.close()
		}
	}
)

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

			const { name, role } = body as {
				name: unknown
				role: unknown
			}

			if (typeof name === 'string') {
				await useClient(async client => {
					await editPenName(client, user as Pal, id, name)
				})

				return res.send()
			}

			if (
				role === null ||
				role === PublicRole.Viewer ||
				role === PublicRole.Editor
			) {
				await useClient(async client => {
					await editPublicRole(client, user as Pal, id, role)
				})

				return res.send()
			}

			throw new HttpError(400, 'Invalid body')
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
