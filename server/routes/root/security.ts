import { Router } from 'express'
import { getCSP, SELF, INLINE, EVAL, DATA } from 'csp-header'

import { DEV, ORIGIN, SOCKET_ORIGIN } from '../../constants'

const router = Router()

router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Origin', ORIGIN)

	res.header(
		'Content-Security-Policy',
		getCSP({
			directives: {
				'default-src': [SELF],
				'connect-src': [
					SELF,
					SOCKET_ORIGIN,
					`https://s3.amazonaws.com/${process.env.AWS_S3_BUCKET}`
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
				'upgrade-insecure-requests': !DEV
			}
		})
	)

	next()
})

export default router
