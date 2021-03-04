import { Router } from 'express'
import passport from 'passport'

import security from './security'
import assets from './assets'
import session from './session'
import auth from './auth'
import upload from './upload'
import pal from './pal'
import pen from './pen'
import role from './role'
import invite from './invite'

const router = Router()

router.use(security)
router.use(assets)

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
