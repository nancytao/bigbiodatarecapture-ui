var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('biodata');

var service = {};

service.getById = getById;
service.getByTitle = getByTitle;
service.update = update;

module.exports = service;

function getById(_id) {
	var deferred = Q.defer();

	db.biodata.findById(_id, function (err, biodata) {
		if (err) deferred.reject(err);

		if (biodata) {
			//return biodata
			console.log(biodata);
			deferred.resolve(biodata);
		} else {
			//biodata not found
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function getByTitle(title) {
	var deferred = Q.defer();
	db.biodata.find({title: title}, function(err, biodata) {
	    biodata.each(function(err, biodatum) {
	        deferred.resolve(biodatum);
	    });
	});
	// db.biodata.find({title: '/' + title + '/'}, function (err, biodata) {
	// 	if (err) deferred.reject(err);

	// 	if (biodata) {
	// 		//return biodata
	// 		//console.log(biodata);
	// 		deferred.resolve(biodata);
	// 	} else {
	// 		//biodata not found
	// 		deferred.resolve();
	// 	}
	// });
	return deferred.promise;
}

function update(_id, articleParam) {
    var deferred = Q.defer();

    // validation
    db.biodata.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (_id !== articleParam._id) {
            // PMID changed, so make sure not dumb
            db.biodata.findOne(
                { _id: articleParam._id },
                function (err, article) {
                    if (err) deferred.reject(err);

                    if (article) {
                        // ID already exists
                        deferred.reject('Cannot change ID to "' + req.body.username + '"; it is already taken.')
                    } else {
                        updatePaper();
                    }
                });
        } else {
            updatePaper();
        }
    });

    function updatePaper() {
        // fields to update
        var set = {
            _id: articleParam._id,
            title: articleParam.title,
            authors: articleParam.authors,
            //TODO, figure out which of these need to be added
        };

        db.biodata.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}