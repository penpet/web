import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import { getPenPals } from '../models/PenPal'
import { createInvite } from '../models/Invite'
import Role, { editRole, deleteRole } from '../models/Role'
import { assertAuthenticated } from '../utils/assert'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import { useClient } from '../database'

const router = Router()

router.get(
	'/pens/:pen/pals',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	async ({ params: { pen: penId }, user }, res) => {
		try {
			if (typeof penId !== 'string') throw new HttpError(400, 'Invalid pen')

			const pals = await useClient(client =>
				getPenPals(client, user as Pal | undefined, penId)
			)

			res.send(pals)
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.post(
	'/pens/:pen/pals',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
	assertAuthenticated,
	express.json(),
	async ({ params: { pen: penId }, headers, body, user }, res) => {
		try {
			if (typeof penId !== 'string') throw new HttpError(400, 'Invalid pen')

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { email, role } = body as {
				email: unknown
				role: unknown
			}

			if (
				!(
					typeof email === 'string' &&
					(role === Role.Viewer || role === Role.Editor)
				)
			)
				throw new HttpError(400, 'Invalid body')

			const pal = await useClient(client =>
				createInvite(client, user as Pal, { pen_id: penId, email, role })
			)

			res.send(pal)
		} catch (error) {
			sendError(res, error, 400)
		}
	}
)

router.patch(
	'/pens/:pen/pals/:pal',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
	assertAuthenticated,
	express.json(),
	async ({ params: { pen: penId, pal: palId }, headers, body, user }, res) => {
		try {
			if (!(typeof penId === 'string' && typeof palId === 'string'))
				throw new HttpError(400, 'Invalid query')

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { role, active } = body as {
				role: unknown
				active: unknown
			}

			if (
				!(
					(role === Role.Viewer || role === Role.Editor) &&
					typeof active === 'boolean'
				)
			)
				throw new HttpError(400, 'Invalid body')

			await useClient(async client => {
				await editRole(client, user as Pal, palId, penId, body)
			})

			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.delete(
	'/pens/:pen/pals/:pal',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
	assertAuthenticated,
	express.json(),
	async ({ params: { pen: penId, pal: palId }, headers, body, user }, res) => {
		try {
			if (!(typeof penId === 'string' && typeof palId === 'string'))
				throw new HttpError(400, 'Invalid query')

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { active } = body as { active: unknown }
			if (typeof active !== 'boolean') throw new HttpError(400, 'Invalid body')

			await useClient(async client => {
				await deleteRole(client, user as Pal, palId, penId, body)
			})

			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

export default router
