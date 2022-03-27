import express from 'express'
import passport from 'passport'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
import router from './auth.js'
import cors from 'cors'
dotenv.config()

const app = express()

app.use(express.json())

app.use(
	cookieSession({
		name: process.env.COOKIE_NAME,
		keys: [process.env.COOKIE_KEY],
		maxAge: 24 * 60 * 60 * 1000,
	})
)

app.use(passport.initialize())

app.use(passport.session())

app.use(
	cors({
		origin: [process.env.DEV_HOST],
		methods: 'GET,POST,PUT',
		credentials: true,
	})
)

app.use('/auth', router)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log('Server start on port:', PORT)
})
