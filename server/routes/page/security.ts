import { Router } from 'express'
import { getCSP, SELF, DATA } from 'csp-header'

import { DEV, ORIGIN } from '../../constants'

const router = Router()

router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Origin', ORIGIN)

	res.header(
		'Content-Security-Policy',
		getCSP({
			directives: {
				'default-src': [SELF],
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
