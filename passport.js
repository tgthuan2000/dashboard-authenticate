import dotenv from 'dotenv'
dotenv.config()
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { sanity } from './sanity-client.js'

const verify = (accessToken, refreshToken, profile, done) => {
	// verify login
	const { id, displayName, photos, provider } = profile
	const { value: photo } = photos[0]
	// console.log({ id, displayName, photo })
	// console.log({ accessToken })

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
		})
		.catch((error) => {
			done(error)
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
passport.use(
	new LocalStrategy((username, password, done) => {
		const query =
			'*[_type == "user" && username == $username && password == $password] { _id, fullName, email, phone, address, username }'
		const params = { username, password }

		sanity
			.fetch(query, params)
			.then((data) => {
				done(null, data[0])
			})
			.catch((error) => {
				done(error)
			})
	})
)

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET_JWT,
}
passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		const { _id, iat, exp } = jwt_payload

		if (exp - iat > 0) {
			const query =
				'*[_type == "user" && _id == $_id] { _id, fullName, email, phone, address, username }'
			const params = { _id }

			sanity
				.fetch(query, params)
				.then((data) => {
					done(null, data[0])
				})
				.catch((error) => {
					done(error)
				})
		} else done(null, false)
	})
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
