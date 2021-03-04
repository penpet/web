import { Router } from 'express'
import subdomain from 'express-subdomain'

import security from './security'
import assets from './assets'
import pen from './pen'
import notFound from './notFound'

const router = Router()

router.use(security)
router.use(assets)

router.use(pen)

router.use(notFound)

export default subdomain('p', router)
