import { Router } from 'express'
import passport from 'passport'

import session from './session'
import security from './security'
import auth from './auth'
import upload from './upload'
import pen from './pen'
import pal from './pal'
import invite from './invite'

const router = Router()

router.use(security)
router.use(session)

router.use(passport.initialize())
router.use(passport.session())

router.use(auth)
router.use(upload)
router.use(pen)
router.use(pal)
router.use(invite)

export default router
