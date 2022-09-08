const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, ( email, password, done ) => {
    User.findOne({ where: {email}})
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'User does not exists.' })
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'password is incorrect!'})
            }
           return done(null, user)
        })  
      })
      .catch(err => done(err, false))
   
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, false))
  })
}

