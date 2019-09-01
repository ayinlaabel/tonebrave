const LocalStrategy = require('passport-local'). Strategy;
const bcrypt = require('bcryptjs');
const config = require('./database');
const User = require('../models/users');

module.exports = (passport) =>{
    passport.use(new LocalStrategy((username, password, done) => {

        let query = {username:username};

        User.findOne(query, (err, user) => {
            if (err) throw err;

            if(!user){
                return done(null, false, {message: 'User not Found or Not Register'});
            }

            //Match Password with user
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch) {
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Password does not match user!'});
                }
            })

            
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}