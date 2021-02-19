import { Router } from 'express'
import passport from 'passport'

import session from './session'
import security from './security'
import auth from './auth'
import upload from './upload'
import pal from './pal'
import pen from './pen'
import role from './role'
import invite from './invite'

const router = Router()

router.use(security)
router.use(session)

router.use(passport.initialize())
router.use(passport.session())

router.use(auth)
router.use(upload)
router.use(pal)
router.use(pen)
router.use(role)
router.use(invite)

export default router
