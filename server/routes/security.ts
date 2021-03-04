import { Router } from 'express'

import { DEV } from '../constants'

const router = Router()

router.use(({ headers, url }, res, next) => {
	DEV || headers['x-forwarded-proto'] === 'https'
		? next()
		: res.redirect(301, `https://${headers.host}${url}`)
})

router.use((_req, res, next) => {
	res.header('Expect-CT', '0')
	res.header('Referrer-Policy', 'no-referrer')
	res.header('Strict-Transport-Security', 'max-age=15552000')
	res.header('X-Content-Type-Options', 'nosniff')
	res.header('X-DNS-Prefetch-Control', 'off')
	res.header('X-Download-Options', 'noopen')
	res.header('X-Frame-Options', 'SAMEORIGIN')
	res.header('X-Permitted-Cross-Domain-Policies', 'none')
	res.header('X-XSS-Protection', '0')

	next()
})

export default router
