import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'

import Pal from '../models/Pal'
import { Invite, getPenPals, createInvite } from '../models/PenPal'
import { assertAuthenticated } from '../utils/assert'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import pool from '../database'
import Role from '../models/Role'

const router = Router()

router.get(
	'/pens/:id/pals',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }),
	async ({ params: { id }, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid pen')
			const client = await pool.connect()

			try {
				res.send(await getPenPals(client, user as Pal | undefined, id))
			} finally {
				client.release()
			}
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.post(
	'/pens/:id/pals',
	rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }),
	assertAuthenticated,
	express.json(),
	async ({ params: { id }, headers, body, user }, res) => {
		try {
			if (typeof id !== 'string') throw new HttpError(400, 'Invalid pen')

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { email, role }: Invite = body

			if (
				!(
					typeof email === 'string' &&
					(role === Role.Viewer || role === Role.Editor)
				)
			)
				throw new HttpError(400, 'Invalid body')

			const client = await pool.connect()

			try {
				res.send(await createInvite(client, id, user as Pal, body))
			} finally {
				client.release()
			}
		} catch (error) {
			sendError(res, error, 400)
		}
	}
)

export default router
