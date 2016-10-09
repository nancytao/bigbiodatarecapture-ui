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