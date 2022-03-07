import dotenv from 'dotenv'
dotenv.config()
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { sanity } from './sanity-client.js'

const verify = (accessToken, refreshToken, profile, done) => {
	// verify login
	const { id, displayName, photos, provider } = profile
	const { value: photo } = photos[0]
	console.log({ id, displayName, photo })
	console.log({ accessToken })

	sanity
		.createIfNotExists({
			_type: 'passport',
			_id: id,
			fullName: displayName,
			image: photo,
			provider,
			role: {
				_type: 'reference',
				_ref: '74f4c054-ed49-40d6-b910-a548810a4e3e',
			},
		})
		.then((value) => {
			done(null, { ...value, accessToken })
			console.log('OK')
		})
		.catch((error) => {
			done(error)
			console.log('failed')
		})
}

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		verify
	)
)
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: '/auth/facebook/callback',
		},
		verify
	)
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
