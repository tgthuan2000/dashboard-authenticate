import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		(accessToken, refreshToken, profile, cb) => {
			// User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user))
			cb(null, profile)
		}
	)
)
