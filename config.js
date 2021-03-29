const appInfo = require('./appInfo');

module.exports = {
    'secretKey': appInfo.secretKey,
    'mongoUrl' : 'mongodb://localhost:27017/hotelsite',
    'google': {
        clientId: appInfo.clientId,
        clientSecret: appInfo.clientSecret,
        redirectUrl: 'https://localhost:3500/users/auth/google/callback'
    }
}