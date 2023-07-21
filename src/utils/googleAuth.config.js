const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');
const { date } = require('joi');
const config = require('../config/config')



passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new googleStrategy({
	clientID: config.google.GOOGLE_CLIENT_ID, // Your Credentials here.
	clientSecret: config.google.GOOGLE_CLIENT_SECRET,
	callbackURL:"http://localhost:3000/v1/authg/google/callback",
	passReqToCallback:true
},
async function(request, accessToken, refreshToken, profile, done) {
	const userExists = await userModel.findOne({email : profile.emails[0].value})
	if(!userExists){
		const user = {
			username : profile.displayName,
			first_name : profile.name.givenName,
			last_name : profile.name.familyName,
			email : profile.emails[0].value,
			profile : profile._json.picture,
		}
		const userData = await userModel.create(user)
		return done(null, userData._id);
	}
	return done(null, userExists._id);
}
));

module.exports = passport;