var config = require('config.json');
var express = require('express');
var router = express.Router();
var biodataService = require('services/biodata.service');

//routes
router.get('/:_id', getPaper);
router.get('/title/:title', getPaperByTitle);

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

function getPaperByTitle(req, res) {
	biodataService.getByTitle(req.params.title)
		.then(function(title) {
			if (title) {
				res.send(title);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function (err) {
			res.status(400).send(err);
		});
}

function updateArticle(req, res) {
	biodataService.update(req.params._id, req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}