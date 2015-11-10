var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/profiles_test';

// helpers
function countMatchedProfiles(cursor, db, next, req) {
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
			db.close();
			next();
		}
	});	
}

// main functions
function addProfile(req, res, next) {
	
	console.log(req.body.email);
	console.log(req.body.password);
	console.log(req.body.confirm);
	
	newProfile =	{"email": req.body.email,
						"password": req.body.password,
						"description": "This is a generic description",
						"image": null,
						"display_name": req.body.email};
						
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
		countMatchedProfiles(cursor, db, next, req);
	});
}

function getAllProfiles(req, res, next) {
	
	var profiles = [];
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
		var cursor = db.collection('profiles').find( );
		cursor.each(function(err, profile) {
			assert.equal(err, null);
			if (profile != null) {
				var stripedProfile = {};
				
				stripedProfile["email"] = profile.email;
				stripedProfile["display_name"] = profile.display_name;
				
				profiles.push(stripedProfile);		
			} else {
				req.profiles = profiles;
				db.close();
				
				next();
			}
		});
	});
}

function profileViewSetup(req, res, next) {
	
	var viewableProfile = {};
	var email = req.params.email;
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
		var cursor = db.collection('profiles').find( {"email": email} );
		cursor.each(function(err, profile) {
			assert.equal(err, null);
			if (profile != null) {
					
				viewableProfile["email"] = profile.email;
				viewableProfile["display_name"] = profile.display_name;
				viewableProfile["description"] = profile.description;
			} else {
				req.viewableProfile = viewableProfile;
				db.close();
				
				next();
			}
		});
	});
}

// exports
module.exports.addProfile = addProfile;
module.exports.validateLogin = validateLogin;
module.exports.getAllProfiles = getAllProfiles;
module.exports.profileViewSetup = profileViewSetup;