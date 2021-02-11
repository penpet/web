import { Router } from 'express'
import passport from 'passport'

import session from './session'
import cors from './cors'
import auth from './auth'
import upload from './upload'
import pen from './pen'

const router = Router()

router.use(cors)
router.use(session)

router.use(passport.initialize())
router.use(passport.session())

router.use(auth)
router.use(upload)
router.use(pen)

export default router
