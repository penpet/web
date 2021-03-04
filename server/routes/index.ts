import { Router } from 'express'

import security from './security'
import page from './page'
import root from './root'

const router = Router()

router.use(security)

router.use(page)
router.use(root)

export default router
