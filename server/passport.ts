import passport from 'passport'
import { Strategy } from 'passport-local'

import Pal, { palFromCredential, palFromId } from './models/Pal'

passport.use(
	new Strategy({ usernameField: 'email' }, async (email, password, done) => {
		try {
			done(null, await palFromCredential(email, password))
		} catch (error) {
			console.error(error)
			done(error)
		}
	})
)

passport.serializeUser((user, done) => {
	done(null, (user as Pal).id)
})

passport.deserializeUser(async (id: string, done) => {
	try {
		done(null, await palFromId(id))
	} catch (error) {
		console.error(error)
		done(error)
	}
})
