var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('biodata');
db.bind('changelog');

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

function update(_id, paperParam, user) {
    var deferred = Q.defer();

    var changes = [];

    db.biodata.findById(_id, function (err, biodata) {
        if (err) deferred.reject(err);

        if (_id !== paperParam._id) {
            // PMID changed, so make sure not dumb
            deferred.reject("Cannot change paper ID");
        } else {
            for (var key in paperParam) {
                if (paperParam.hasOwnProperty(key)) {
                    //console.log(key + " -> " + paperParam[key]);
                    if (biodata[key] !== paperParam[key]) {
                        var changedItem = {
                            'field': key,
                            'old': biodata[key],
                            'new': paperParam[key],
                        }

                        console.log(changedItem);
                        changes.push(changedItem);
                    }
                }
            }

            updatePaper();
        }
    });

    function updatePaper() {
        // fields to update
        var set = {
            title: paperParam.title,
            authors: paperParam.authors
        };

        db.biodata.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });

        for (i = 0; i < changes.length; i++) {
            item = changes[i];

            var change = {
                // username, Time, Paper_ID, Field_Name, Old, New
                'user': user,
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