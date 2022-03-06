import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login/failed', (req, res) => {
	res.status(401).json({
		success: false,
		message: 'Authenticate failure',
	})
})

router.get('/login/success', ({ user }, res) => {
	if (user) {
		res.json({
			success: true,
			message: 'Authenticate successfull',
			user,
		})
	}
})

router.get('/logout', (req, res) => {
	req.logOut()
	res.redirect('')
})

router.get('/google', passport.authenticate('google'))

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '',
		failureRedirect: '/login/failed',
	})
)

export default router
