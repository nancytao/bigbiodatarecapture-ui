var config = require('config.json');
var express = require('express');
var router = express.Router();
var biodataService = require('services/biodata.service');

// running .sh or .py scripts
var exec = require('child_process').exec, child;
var shtest = exec('sh ./services/scripts/test.sh');
var pythontest = exec('python ./services/scripts/test.py');

// routes
router.get('/:_id', getPaper);
router.get('/title/:title', getPaperByTitle);
router.put('/:_id', updatePaper);
router.put('/pdf/:_id', uploadPDF);

module.exports = router;

shtest.stdout.on('data', function(data) {
	console.log(data);
});
pythontest.stdout.on('data', function(data) {
	console.log(data);
});


function getPaper(req, res) {
	biodataService.getById(req.params._id)
		.then(function(paperID) {
			if (paperID) {
				res.send(paperID);
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

function updatePaper(req, res) {
	if (req.user.permissions >= 20) {
		biodataService.update(req.params._id, req.body, req.user.sub)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
	} else {
		res.sendStatus(401);
	}

}

function uploadPDF(req, res) {
	if (req.user.permissions >= 20) {
		biodataService.uploadPDF(req.params._id, req.body, req.user.sub)
			.then(function() {
				res.sendStatus(200);
			})
			.catch(function(err) {
				res.status(400).send(err);
			});
	} else {
		res.sendStatus(401);
	}
}