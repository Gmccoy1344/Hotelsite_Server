const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens 

const config = require('./config.js');
const GoogleStrategy = require('passport-google-oauth2').Strategy;;

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.googlePassport = passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.redirectUrl,
            passReqToCallback: true
        }, 
        function(request, accessToken, refreshToken, profile, done) {
            User.findOne({ googleId: profile.id }, function(err, user) {
                if(err) {
                    console.log(err);  // handle errors!
                }
                if (!err && user !== null) {
                    done(null, user);
                } else {
                    user = new User({username: profile.displayName,});
                    user.googleId = profile.id;
                    user.save(function(err) {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                    });
                }
            }
        );
    }
        
));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function(req, res, next) {
    const admin = req.user.admin;
    if(admin) {
        return next();
    }else {
        err = new Error("You are not authorized to perform this operation!")
        err.status = 403;
        return next(err);
    }
};