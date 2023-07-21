const router = require('express').Router();
const passport = require('../../utils/githubAuth.config');
const tokenService = require('../../services/token.service')

router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));

router.get( '/github/callback',
passport.authenticate( 'github', {
        successRedirect: '/v1/authg/callback/success',
        failureRedirect: '/v1/authg/callback/failure'
}));

// Success 
router.get('/callback/success' , async (req , res) => {
    if(!req.user){
        res.redirect('/callback/failure');
    }
    const userId = req.user; 
    const tokens = await tokenService.generateAuthTokens(userId);
    res.status(200).send(tokens)
});

// failure
router.get('/callback/failure' , (req , res) => {
    res.send("Error");
})






module.exports = router;