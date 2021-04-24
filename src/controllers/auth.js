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
	res.status(404).json({ err: "not implemented" })
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

	return newUser.save(function (err, doc) {
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