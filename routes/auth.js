import express from 'express'
import passport from 'passport'
// import { client } from '../sanity-client.js'

const router = express.Router()

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
	res.redirect('http://localhost:3000')
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
		successRedirect: 'http://localhost:3000',
		failureRedirect: '/login',
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
		successRedirect: 'http://localhost:3000',
		failureRedirect: '/login',
	})
)

// @route POST auth/register
// @desc Register user
// @access Public
// router.post('/register', (req, res) => {
// 	const { username, password } = req
// 	if (!username || !password) {
// 		res.status(400).json({
// 			success: false,
// 			message: 'Missing username or password',
// 		})
// 	}

// 	try {
// 		client
// 			.fetch(`*[_type == 'user' && username == ${username}]`)
// 			.then((data) => console.log(data))
// 	} catch (err) {}
// })

export default router
