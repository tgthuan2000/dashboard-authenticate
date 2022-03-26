import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import cors from 'cors'
const successRedirect = 'http://localhost:3000'
const failureRedirect = '/auth/login'
const router = express.Router()

router.use(
	cors({
		origin: ['http://localhost:3000', 'https://velzon-dashboard.netlify.app'],
		methods: 'GET,POST,PUT',
		credentials: true,
	})
)

// @route GET auth/login
// @desc Login
// @access Public
router.get('/login', ({ user }, res) => {
	if (user) {
		res.json({ success: true, user })
	} else {
		res.status(401).json({ success: false })
	}
})

// @route GET auth/logout
// @desc Logout
// @access Public
router.get('/logout', (req, res) => {
	req.logOut()
	res.redirect(successRedirect)
})

// @route GET auth/google
// @desc Authenticate with Google
// @access Public
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @route GET auth/google/callback
// @desc Callback of Google
// @access Public
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect,
		failureRedirect,
	})
)

// @route GET auth/facebook
// @desc Authenticate with Facebook
// @access Public
router.get(
	'/facebook',
	passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] })
)

// @route GET auth/facebook/callback
// @desc Callback of Facebook
// @access Public
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect,
		failureRedirect,
	})
)

// @route POST auth/local/login
// @desc Authenticate with username password
// @access Public
router.post(
	'/local/login',
	passport.authenticate('local', { failureRedirect }),
	({ user }, res) => {
		if (user) {
			const tokenAccess = jwt.sign({ _id: user._id }, process.env.SECRET_JWT, {
				expiresIn: 24 * 60 * 60 * 1000,
			})
			res.json({ success: true, tokenAccess, user })
		}
	}
)

// @route GET auth/local/re-login
// @desc Authenticate with jwt
// @access Public
router.get('/local/re-login', passport.authenticate('jwt', { session: false }), ({ user }, res) => {
	if (user) {
		res.json({ success: true, user })
	}
})

export default router
