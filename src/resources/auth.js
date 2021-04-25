import Auth from '../controllers/auth';
import validate from '../utils/validate';
import userValidation from '../validation/user';

module.exports = app => {
	app.route('/auth/login').post(userValidation.login, validate, Auth.login);
	app.route('/auth/signup').post(userValidation.signup, validate, Auth.signup);

	/*** BONUS POINTS ***/
	app.route('/auth/forgot-password').post(Auth.SendToken);
	app.route('/auth/reset-password').post(Auth.verifyTokenNResetPassword);
};
