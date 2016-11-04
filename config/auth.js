// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : process.env.FACEBOOK_CLIENT_ID,
        'clientSecret'    : process.env.FACEBOOK_CLIENT_SECRET,
        'callbackURL'     : process.env.FACEBOOK_CALLBACK_URL,
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
    },

    'googleAuth' : {
        'clientID'         : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'     : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'      : process.env.GOOGLE_CALLBACK_URL
    }

};
