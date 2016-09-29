var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {native_parser: true});
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
	var deferred = Q.defer();

	db.users.findOne({ username: username }, function (err, user) {
		if (err) deferred.reject(err);

		if (user && bcrypt.compareSync(password, user.hash)) {
			//auth successful
			deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
		} else {
			//auth failed
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getById(_id) {
	var deferred = Q.defer();

	db.users.findById(_id, function (err, user) {
		if (err) deferred.reject(err);

		if (user) {
			//return user
			deferred.resolve(_.omit(user, 'hash'));
		} else {
			//user not found
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function create(userParam) {
	var deferred = Q.defer();

	//validation
	db.users.findOne(
		{ username: userParam.username },
		function (err, user) {
			if (err) deferred.reject(err);

			if (user) {
				//username already exists
				deferred.reject('Username "' + userParam.username + '" is already taken');
			} else {
				createUser();
			}
		});
	function createUser() {
		//set user object to userParam without cleartext pass
		var user = _.omit(userParam, 'password');

		//hash password, add to object
		user.hash = bcrypt.hashSync(userParam.password, 10);

		db.users.insert(
			user,
			function(err, doc) {
				if (err) deferred.reject(err);

				deferred.resolve();
			});
	}
	return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();
 
    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err);
 
        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);
 
                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });
 
    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            team: userParam.team
        };
 
        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }
 
        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);
 
                deferred.resolve();
            });
    }
 
    return deferred.promise;
}
 
// prefixed function name with underscore because 'delete' is a reserved word in javascript
function _delete(_id) {
    var deferred = Q.defer();
    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}