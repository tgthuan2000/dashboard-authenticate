import express from 'express'
import passport from 'passport'
import cookieSession from 'cookie-session'
import cors from 'cors'
import authRoute from './routes/auth.js'

const app = express()

app.use(cookieSession({ name: 'tgthuan2000', keys: ['tgthuan'], maxAge: 24 * 60 * 60 * 100 }))

app.use(passport.initialize())

app.use(passport.session())

app.use(
	cors({
		origin: ['http://localhost:3000', 'https://velzon-dashboard.netlify.app'],
		credentials: true,
	})
)

app.use('/auth', authRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log('Server start on port:', PORT)
})
