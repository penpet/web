import passport from 'passport'
import { Strategy } from 'passport-local'

import Pal, { palFromCredential, palFromId } from './models/Pal'
import pool from './database'

passport.use(
	new Strategy({ usernameField: 'email' }, async (email, password, done) => {
		try {
			const client = await pool.connect()

			try {
				done(null, await palFromCredential(client, email, password))
			} finally {
				client.release()
			}
		} catch (error) {
			done(error)
		}
	})
)

passport.serializeUser((user, done) => {
	done(null, (user as Pal).id)
})

passport.deserializeUser(async (id: string, done) => {
	try {
		const client = await pool.connect()

		try {
			done(null, await palFromId(client, id))
		} finally {
			client.release()
		}
	} catch (error) {
		done(error)
	}
})
