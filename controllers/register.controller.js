var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
	res.render('register');
});

router.post('/', function(req, res) {
	//register using api
	request.post({
		url:config.apiUrl + '/users/register',
		form: req.body,
		json: true
	}, function (error, response, body) {
		if (error) {
			return res.render('register', {error: 'An error has occurred'});
		}
		if (response.statusCode !== 200) {
			return res.render('register', {
				error: response.body,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username
			});
		}

		//return to login page
		req.session.success = 'Registration successful';
		return res.redirect('/login');
	});
});
module.exports = router;