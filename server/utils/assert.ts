import { RequestHandler } from 'express'

export const assertAuthenticated: RequestHandler = (req, res, next) => {
	if (req.isAuthenticated()) return next()
	res.status(401).send('Not logged in')
}

export const assertUnauthenticated: RequestHandler = (req, res, next) => {
	if (!req.isAuthenticated()) return next()
	res.status(401).send('Already logged in')
}
