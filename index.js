import express from 'express'
import passport from 'passport'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const app = express()

const PORT = process.env.PORT || 5000

app.use(cookieSession({ name: 'tgthuan2000', keys: ['tgthuan'], maxAge: 24 * 60 * 60 * 100 }))
app.use(passport.initialize())
app.use(passport.session())
app.use(
	cors({
		origin: ['http://localhost:3000'],
		credentials: true,
	})
)

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://www.example.com/auth/google/callback',
		},
		(accessToken, refreshToken, profile, cb) => {
			User.findOrCreate({ googleId: profile.id }, (err, user) => cb(err, user))
		}
	)
)

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect('/')
	}
)

app.listen(PORT, () => {
	console.log('Server start on port:', PORT)
})
