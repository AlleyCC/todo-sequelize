const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User


module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  
  //local authentication
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, ( req, email, password, done ) => {
    User.findOne({ where: {email}})
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'User does not exists.'))
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Password incorrect!'))
            }
            return done(null, user)
          })  
      })
      .catch(err => done(err, false))
  }))

  //Facebook authentication
  passport.use(new FacebookStrategy({
    clientID: '1184627148757079',
    clientSecret: 'e463f7b489140035a64dba79b072492d',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['displayName', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    console.log(profile)
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => 
            User.create({
              name, 
              email,
              password: hash
            })
          )
          .then(() => done(null, user))
          .catch(err => done(err, false))
      })
  }
));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}

