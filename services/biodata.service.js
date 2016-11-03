var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});

db.bind('biodata');
db.bind('changelog');
db.bind('users');

var service = {};

service.getById = getById;
service.getByTitle = getByTitle;
service.update = update;
service.uploadPDF = uploadPDF;

module.exports = service;

function getById(_id) {
	var deferred = Q.defer();

	db.biodata.findById(_id, function (err, biodata) {
		if (err) deferred.reject(err);

		if (biodata) {
			//return biodata
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

    db.biodata.find({title: {$regex: title, $options: 'i'}}).toArray(function(err, biodata) {
        if (err) deferred.reject(err);

        if (biodata.length == 0) {  // if no results
            deferred.resolve();
        } else {
            deferred.resolve(biodata);
        }


    });

	return deferred.promise;
}

function uploadPDF(_id, paperParam, user) {
    var deferred = Q.defer();

    var changes = [];
    var username = null;

    db.users.findById(user, function (err, db_user) {
        if (err) deferred.reject(err);

        if (db_user) {
            username = db_user['username'];
        } else {
            deferred.reject("Must be signed in to modify paper data")
        }
    });

    db.biodata.findById(_id, function (err, biodata) {
        if (err) deferred.reject(err);
        if (biodata) {
            if (biodata["pdf"] !== paperParam["pdf"]) {
                var changedItem = {
                    'field': "pdf",
                    'old': biodata["pdf"],
                    'new': paperParam["pdf"],
                }
                changes.push(changedItem);
            }
            updatePaper();
        } else {
            deferred.reject("Cannot find paper");
        }
    });

    function updatePaper() {
        // fields to update
        var set = {
            pdf: paperParam.pdf,
        };

        // update the actual paper
        db.biodata.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });

        // for every field changed, add an entry in the change log
        var change = {
            'user_id': user,
            'username': username,
            'date': new Date(),
            'paper_ID': _id,
            'field_name': 'pdf',
            'old': item['old'],
            'new': item['new']
        }

        db.changelog.insert(
            change,
            function(err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, paperParam, user) {
    var deferred = Q.defer();

    var changes = [];
    var username = null;

    db.users.findById(user, function (err, db_user) {
        if (err) deferred.reject(err);

        if (db_user) {
            username = db_user['username'];
        } else {
            deferred.reject("Must be signed in to modify paper data")
        }
    });

    db.biodata.findById(_id, function (err, biodata) {
        if (err) deferred.reject(err);

        if (_id !== paperParam._id) {
            // Cannot change paper ID
            // modify design to make this unnecessary, because right now it will do it
            deferred.reject("Cannot change paper ID");
        } else if (biodata) {
            for (var key in paperParam) {
                if (paperParam.hasOwnProperty(key)) {
                    // console.log(key + " -> " + paperParam[key]);
                    if (biodata[key] !== paperParam[key]) {
                        var changedItem = {
                            'field': key,
                            'old': biodata[key],
                            'new': paperParam[key],
                        }

                        changes.push(changedItem);
                    }
                }
            }

            updatePaper();
        } else {
            deferred.reject("Cannot find paper");
        }
    });

    function updatePaper() {
        // fields to update
        var set = {
            title: paperParam.title,
            authors: paperParam.authors
        };

        // update the actual paper
        db.biodata.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });

        // for every field changed, add an entry in the change log
        for (i = 0; i < changes.length; i++) {
            item = changes[i];

            var change = {
                'user_id': user,
                'username': username,
                'date': new Date(),
                'paper_ID': _id,
                'field_name': item['field'],
                'old': item['old'],
                'new': item['new']
            }

            db.changelog.insert(
                change,
                function(err, doc) {
                    if (err) deferred.reject(err);

                    deferred.resolve();
                });
        }
    }

    return deferred.promise;
}