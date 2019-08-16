const LocalStrategy = require('passport-local'). Strategy;
const bcrypt = require('bcryptjs');
const config = require('./database');
const User = require('../models/users');

module.export = (passport) =>{
    passport.use(new LocalStrategy((username, password, done) => {

        let query = {username:username};

        User.findOne(query, (err, user) => {
            if (err) throw err;

            if(!user){
                return done(null, false, {message: 'User not Found / Not Register'});
            }

            
        })
    }))
}