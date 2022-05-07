import express from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import './passport.js'
import { CHECK_USERNAME } from './query.js'
import { sanity } from './sanity-client.js'

const successRedirect = process.env.DEV_HOST
const failureRedirect = '/auth/login'
const router = express.Router()

// @route GET /auth/login
// @desc Login
// @access Public
router.get('/login', ({ user }, res) => {
	if (user) {
		res.json({ success: true, user })
	} else {
		res.status(401).json({ success: false })
	}
})

// @route GET /auth/logout
// @desc Logout
// @access Public
router.get('/logout', (req, res) => {
	req.logOut()
	res.redirect(successRedirect)
})

// @route GET /auth/google
// @desc Authenticate with Google
// @access Public
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @route GET /auth/google/callback
// @desc Callback of Google
// @access Public
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect,
		failureRedirect,
	})
)

// @route GET /auth/facebook
// @desc Authenticate with Facebook
// @access Public
router.get(
	'/facebook',
	passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] })
)

// @route GET /auth/facebook/callback
// @desc Callback of Facebook
// @access Public
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect,
		failureRedirect,
	})
)

// @route POST /auth/local/login
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

// @route GET /auth/local/re-login
// @desc Authenticate with jwt
// @access Public
router.get('/local/re-login', passport.authenticate('jwt', { session: false }), ({ user }, res) => {
	if (user) {
		res.json({ success: true, user })
	}
})

// @route GET /auth/local/register
// @desc Authenticate with jwt
// @access Public
router.post('/local/register', (req, res) => {
	const { username, password, address, email, fullName, phone } = req.body

	if (username) {
		sanity.fetch(CHECK_USERNAME, { username }).then((data) => {
			if (data.length > 0)
				res.status(400).json({ success: false, message: 'Username already' })
			else {
				sanity
					.create({
						_type: 'user',
						username,
						password,
						address,
						email,
						fullName,
						phone,
						role: {
							_type: 'reference',
							_ref: process.env.CUSTOMER_ROLE,
						},
					})
					.then((user) => {
						const tokenAccess = jwt.sign({ _id: user._id }, process.env.SECRET_JWT, {
							expiresIn: 24 * 60 * 60 * 1000,
						})
						res.json({ success: true, user, tokenAccess })
					})
					.catch((err) => {
						res.status(500).json({ success: false, message: 'Internal Server' })
						console.log({ err })
					})
			}
		})
	} else {
		res.status(401).json({ success: false, message: 'Username is required' })
	}
})

export default router
