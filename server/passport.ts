import passport from 'passport'
import { Strategy } from 'passport-local'

import Pal, { palFromCredential, palFromId } from './models/Pal'
import { useClient } from './database'

passport.use(
	new Strategy({ usernameField: 'email' }, async (email, password, done) => {
		try {
			await useClient(async client => {
				done(null, await palFromCredential(client, email, password))
			})
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
		await useClient(async client => {
			done(null, await palFromId(client, id))
		})
	} catch (error) {
		done(error)
	}
})
