var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/profiles_test';

// helpers
function countMatchedProfiles(cursor, db, next, req) {
	cursor.each(function(err, profile) {
		assert.equal(err, null);
		if (profile != null) {
			console.log("User login data matched");
			req.profileCount++;
		} else {
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
	
	if (req.body.password === req.body.confirm) {
	
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
	} else {
		next();
	}
}

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

function updateProfile(req, res, next) {
	if (req.session.sessionid != undefined) {
	
		var display_name = req.body.display_name;
		var description = req.body.description;
		
		MongoClient.connect(url, function(err, db) {
			assert.equal(err, null);
			db.collection('profiles').updateOne(
				{"email": req.session.sessionid},
				{$set: {"display_name" : display_name, "description": description}}, 
				function(err, results) {
					db.close();
					console.log("Redirecting to editprofile");
					res.redirect('/editprofile');
				});
		});
	} else {
		next();
	}
}

function changePassword(req, res, next) {
	if (req.session.sessionid != undefined &&
		req.body.new_password === req.body.confirm_password) {
	
		var oldPass = req.body.old_password;
		var newPass = req.body.new_password;
		
		MongoClient.connect(url, function(err, db) {
			assert.equal(err, null);

			db.collection('profiles').updateOne(
				{"email": req.session.sessionid},
				{$set: {"password": newPass}}, 
				function(err, results) {
					db.close();
					console.log("Redirecting to editprofile");
					res.redirect('/editprofile');
				});
		});
	} else {
		next();
	}
}

// exports
module.exports.addProfile = addProfile;
module.exports.validateLogin = validateLogin;
module.exports.getAllProfiles = getAllProfiles;
module.exports.profileViewSetup = profileViewSetup;
module.exports.updateProfile = updateProfile;
module.exports.changePassword = changePassword;