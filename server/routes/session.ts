import session from 'express-session'
import store from 'connect-pg-simple'
import { Pool } from 'pg'

import { DEV } from '../constants'

const MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10

const databaseUrl = process.env.DATABASE_URL
const secret = process.env.SESSION_SECRET

if (!(databaseUrl && secret)) throw new Error('Missing session credentials')

export default session({
	store: new (store(session))({
		pool: new Pool({
			connectionString: databaseUrl,
			ssl: { rejectUnauthorized: false }
		}),
		tableName: 'sessions'
	}),
	secret,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: MAX_AGE, secure: !DEV, sameSite: true }
})
