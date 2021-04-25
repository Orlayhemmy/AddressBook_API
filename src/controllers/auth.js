import User from '../entities/user';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendMail from '../helpers/sendMail';

require('dotenv').config({
	path: `${__dirname}/../../.env`,
})

/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const login = (req, res) => {
	const { password, email } = req.body

	return User.findOne({ email }, (err, doc) => {
		if (err) {
			res.status(500).json({ success: false, message: "An error occurred, try later!" })
		}

		if (!doc || !doc.verifyPasswordSync(password)) {
			return res.status(400).json({ success: false, message: "Wrong login details!" })
		}

		return res.status(200).json({
			success: true,
			message: "Signed In!", token: jwt.sign({
				id: doc._id,
				username: doc.username,
				email,
				exp: Math.floor(Date.now() / 1000) + (60 * 60),
			}, process.env.TOKEN_KEY)
		})
	})
};
/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Create a new user and return some authentication token 
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const signup = (req, res) => {
	const { username, password, email, name } = req.body

	const newUser = new User({
		email,
		username,
		password,
		name
	})

	return newUser.save((err, doc) => {
		if (err) {
			res.status(500).json({ message: "An error occurred, try later!" })
		}

		return res.status(201).json({
			success: true,
			message: "Account created!", token: jwt.sign({
				id: doc._id,
				email,
				username,
				exp: Math.floor(Date.now() / 1000) + (60 * 60),
			}, process.env.TOKEN_KEY)
		})

	});
};
/**
 * Implement a way to recover user accounts
 */
const SendToken = async (req, res) => {
	const { email } = req.body
	let token = null

	return User.findOne({ email }, async (err, doc) => {
		if (err) {
			return res.status(500).json({ success: false, message: "An error occurred, try later!" })
		}

		if (!doc) return res.status(400).json({ success: false, message: "Email does not exist!" })

		token = crypto.randomBytes(32).toString('hex')

		const text = `This is the token to reset your password: ${token}.\n Please ignore this email if the action wasn't initiated by you!`
		const options = {
			receiver: email,
			subject: 'Your password reset token (valid for one hour)',
			text
		}

		try {
			await sendMail(options)

			doc.passwordResetToken = token
			doc.passwordResetExpires = Date.now() + 60 * 60 * 1000
			doc.save()

			return res.status(200).json({ success: true, message: "A token has been sent to your email!" })
		} catch (err) {
			return res.status(500).json({ success: false, message: "Token not sent, please check your connection and try again!" })
		}
	})
}

const verifyTokenNResetPassword = (req, res) => {
	const { token, email, password } = req.body

	return User.findOne({ email }, async (err, doc) => {
		if (err) {
			return res.status(500).json({ success: false, message: "An error occurred, try later!" })
		}

		if (!doc) return res.status(400).json({ success: false, message: "Email does not exist!" })

		if (token !== doc.passwordResetToken) {
			return res.status(400).json({ success: false, message: 'incorrect token, please use a valid token' })
		}

		if (doc.passwordResetExpires < Date.now()) {
			return res.status(401).json({ success: false, message: 'Token has expired' })
		}

		doc.password = password
		doc.passwordResetToken = undefined
		doc.passwordResetExpires = undefined

		await doc.save()

		return res.status(200).json({ success: true, message: 'Password reset successful' })
	})
}

export default {
	login,
	signup,
	SendToken,
	verifyTokenNResetPassword
}