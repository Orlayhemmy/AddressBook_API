import Auth from '../controllers/auth';
import validate from '../utils/validate';
import userValidation from '../validation/user';

module.exports = app => {
	app.route('/auth/login').post(userValidation.signup, validate, Auth.login);
	app.route('/auth/signup').post(userValidation.signup, validate, Auth.signup);

	/*** BONUS POINTS ***/
	app.route('/auth/forgotPassword').post(Auth.forgotPassword);
};
