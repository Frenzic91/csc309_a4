var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/profiles_test';

// db comes from connecting to db
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
		db.collection('profiles').insertOne(newProfile, function (err, result) {
			assert.equal(err, null);
			console.log("Added a new profile");
			next();
		});
	});
};

module.exports.addProfile = addProfile;