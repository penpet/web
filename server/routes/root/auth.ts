import express, { Router } from 'express'
import passport from 'passport'
import rateLimit from 'express-rate-limit'

import Pal, { palToPublic, createPal, editPalName } from '../../models/Pal'
import HttpError from '../../utils/HttpError'
import sendError from '../../utils/sendError'
import {
	assertAuthenticated,
	assertUnauthenticated
} from '../../middleware/assert'
import { useClient } from '../../database'

import '../../passport'

const router = Router()

router.get('/auth', ({ user }, res) => {
	res.json(user ? palToPublic(user as Pal) : null)
})

router.patch(
	'/auth',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	express.json(),
	async ({ headers, body, user }, res) => {
		try {
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

			await useClient(client => editPalName(client, user as Pal, name))
			res.send()
		} catch (error) {
			sendError(res, error, 500)
		}
	}
)

router.post(
	'/auth/log-in',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertUnauthenticated,
	express.json(),
	async (req, res, next) => {
		try {
			const user = await new Promise<Pal>((resolve, reject) => {
				passport.authenticate('local', (error, user: Pal | null) => {
					if (error) return reject(error)
					if (!user) return reject(new HttpError(404, 'No such user exists'))

					req.logIn(user, error => {
						error ? reject(error) : resolve(user)
					})
				})(req, res, next)
			})

			res.send(palToPublic(user))
		} catch (error) {
			sendError(res, error, 401)
		}
	}
)

router.post(
	'/auth/sign-up',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }),
	assertUnauthenticated,
	express.json(),
	async (req, res) => {
		try {
			const { headers, body } = req

			if (
				!(
					headers['content-type'] === 'application/json' &&
					typeof body === 'object' &&
					body
				)
			)
				throw new HttpError(400, 'Invalid body')

			const { name, email, password } = body as {
				name: unknown
				email: unknown
				password: unknown
			}

			if (
				!(
					typeof name === 'string' &&
					typeof email === 'string' &&
					typeof password === 'string'
				)
			)
				throw new HttpError(400, 'Invalid body')

			const pal = await useClient(client =>
				createPal(client, name, email, password)
			)

			await new Promise<void>((resolve, reject) => {
				req.logIn(pal, error => {
					error ? reject(error) : resolve()
				})
			})

			res.send(palToPublic(pal))
		} catch (error) {
			sendError(res, error, 401)
		}
	}
)

router.post(
	'/auth/sign-out',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertAuthenticated,
	(req, res) => {
		req.logOut()
		res.send()
	}
)

export default router
