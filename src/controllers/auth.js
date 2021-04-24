import User from '../entities/user';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken'

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
			console.error(err);
			res.status(500).json({ message: "An error occurred, try later!" })
		}

		if (!doc || !doc.verifyPasswordSync(password)) {
			return res.status(400).json({ message: "Wrong login details!" })
		}

		return res.status(200).json({
			message: "Signed In!", token: jwt.sign({
				id: doc._id,
				username: doc.username,
				email,
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
			console.error(err);
			res.status(500).json({ message: "An error occurred, try later!" })
		}

		return res.status(201).json({
			message: "Account created!", token: jwt.sign({
				id: doc._id,
				email,
				username
			}, process.env.TOKEN_KEY)
		})

	});
};
/**
 * Implement a way to recover user accounts
 */
export const forgotPassword = (req, res) => {
	res.status(404).json({ err: "not implemented" })
};

export default {
	login,
	signup,
	forgotPassword
}