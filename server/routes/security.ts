import { Router } from 'express'
import { getCSP, SELF, INLINE, EVAL, DATA } from 'csp-header'

import { DEV, ORIGIN } from '../constants'

const router = Router()

router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Origin', ORIGIN)

	res.header('Expect-CT', '0')
	res.header('Referrer-Policy', 'no-referrer')
	res.header('Strict-Transport-Security', 'max-age=15552000')
	res.header('X-Content-Type-Options', 'nosniff')
	res.header('X-DNS-Prefetch-Control', 'off')
	res.header('X-Download-Options', 'noopen')
	res.header('X-Frame-Options', 'SAMEORIGIN')
	res.header('X-Permitted-Cross-Domain-Policies', 'none')
	res.header('X-XSS-Protection', '0')

	res.header(
		'Content-Security-Policy',
		getCSP({
			directives: {
				'default-src': [SELF],
				'connect-src': [
					SELF,
					`https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET}/`
				],
				'style-src': [SELF, INLINE],
				'script-src': [
					SELF,
					...(DEV ? [EVAL] : []),
					"'sha256-Nqnn8clbgv+5l0PgxcTOldg8mkMKrFn4TvPL+rYUUGg='" // Render-blocking script
				],
				'img-src': [SELF, DATA, 'https://u.pen.pet', 'https://i.ytimg.com'],
				'frame-src': [SELF, 'https://www.youtube.com'],
				'base-uri': SELF,
				'block-all-mixed-content': true,
				'upgrade-insecure-requests': true
			}
		})
	)

	next()
})

router.use('/fonts/*', (_req, res, next) => {
	res.removeHeader('Access-Control-Allow-Credentials')

	res.header('Access-Control-Allow-Origin', '*')
	res.header('Cache-Control', 'public, max-age=31536000, immutable')

	next()
})

export default router
