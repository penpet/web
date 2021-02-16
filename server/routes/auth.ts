import { Router } from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import rateLimit from 'express-rate-limit'

import Pal, { palToPublic, createPal } from '../models/Pal'
import HttpError from '../utils/HttpError'
import sendError from '../utils/sendError'
import { assertAuthenticated, assertUnauthenticated } from '../utils/assert'
import pool from '../database'

import '../passport'

const router = Router()

router.options(
	['/auth/log-in', '/auth/sign-up', '/auth/sign-out'],
	(_req, res, next) => {
		res.header('Access-Control-Allow-Methods', 'OPTIONS, POST')
		res.header('Access-Control-Allow-Headers', 'Content-Type')

		next()
	}
)

router.get('/auth', ({ user }, res) => {
	res.json(user ? palToPublic(user as Pal) : null)
})

router.post(
	'/auth/log-in',
	rateLimit({ windowMs: 60 * 60 * 1000, max: 60 }),
	assertUnauthenticated,
	bodyParser.json(),
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
	bodyParser.json(),
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

			const { name, email, password } = body

			if (
				!(
					typeof name === 'string' &&
					typeof email === 'string' &&
					typeof password === 'string'
				)
			)
				throw new HttpError(400, 'Invalid body')

			const client = await pool.connect()

			try {
				const pal = await createPal(client, name, email, password)

				await new Promise<void>((resolve, reject) => {
					req.logIn(pal, error => {
						error ? reject(error) : resolve()
					})
				})

				res.send(palToPublic(pal))
			} finally {
				client.release()
			}
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
