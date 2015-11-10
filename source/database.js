var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/profiles_test';

function addProfile(req, res, next) {
	
	console.log(req.body.email);
	console.log(req.body.password);
	console.log(req.body.confirm);
	
	newProfile =	{"email": req.body.email,
						"password": req.body.password,
						"description": "This is a generic description",
						"image": null,
						"display_name": req.body.password};
						
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
		db.collection('profiles').insertOne(newProfile, function (err, result) {
			assert.equal(err, null);
			console.log("Added a new profile");
			db.close();
			next();
		});
	});
};

function validateLogin(req, res, next) {
	
	var email = req.body.email;
	var password = req.body.password;
	
	req.profileCount = 0;
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
		var cursor = db.collection('profiles').find( {"email": email, "password": password} );
		cursor.each(function(err, profile) {
			assert.equal(err, null);
			if (profile != null) {
				// duplicates ignored?
				console.log("User login data matched");
				// req.sessionid = profile.email;
				// req.validated = true;
				req.profileCount++;
			} else {
				// invalid login info, send user back to login page
				// req.validated = false;
				next();
			}
			db.close();
			});	
	});
}

module.exports.addProfile = addProfile;
module.exports.validateLogin = validateLogin;