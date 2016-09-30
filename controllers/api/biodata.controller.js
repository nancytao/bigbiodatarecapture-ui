var config = require('config.json');
var express = require('express');
var router = express.Router();
var biodataService = require('services/biodata.service');

//routes
router.get('/:_id', getPaper);


module.exports = router;

function getPaper(req, res) {
	biodataService.getById(req.params._id)
		.then(function(articleId) {
			if (articleId) {
				res.send(articleId);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function (err) {
			res.status(400).send(err);
		});
}