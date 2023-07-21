const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
const config = require('../config/config')
const userModel = require('../models/user.model');
var faker = require('faker');


passport.use(new githubStrategy({
	clientID: config.github.GITHUB_CLIENT_ID, // Your Credentials here.
	clientSecret: config.github.GITHUB_CLIENT_SECRET,
	callbackURL:"http://localhost:3000/v1/authg/github/callback",
	passReqToCallback:true
},
async function(request, accessToken, refreshToken, profile, done) {
	const userExists = await userModel.findOne({email : profile._json.email})
	if(!userExists){
		const user = {
			username : profile._json.login,
			email : profile._json.email ? profile._json.email : faker.internet.email(),
			profile : profile._json.avatar_url,
		}
		var userData = await userModel.create(user)
		return done(null, userData._id);
	}
	return done(null, userExists._id);
}
));

module.exports = passport;