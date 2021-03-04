import session from 'express-session'
import store from 'connect-pg-simple'
import { Pool } from 'pg'

import { options as databaseOptions } from '../../database'
import { DEV } from '../../constants'

const MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10

const secret = process.env.SESSION_SECRET
if (!secret) throw new Error('Missing session credentials')

export default session({
	store: new (store(session))({
		pool: new Pool(databaseOptions),
		tableName: 'sessions'
	}),
	secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: MAX_AGE,
		sameSite: DEV ? 'lax' : 'none',
		secure: !DEV
	}
})
