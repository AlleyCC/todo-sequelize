const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const passport = require('passport')

const db = require('../../models')
const User = db.User

//login
router.get('/login', (req, res)=> {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureFlash: true
}))

//register
router.get('/register', (req, res)=> {
  res.render('register')
})

router.post('/register', (req, res)=> {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirmPassword are not the same.' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  return User.findOne({ where: { email }})
    .then(user => {
      if (user) {
        errors.push({ message: 'This email registered before.' })
        return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
        errors
      })
  }
  return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => {
      User.create({
        name,
        email,
        password: hash
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
  }) 
})

//logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
  })
  req.flash('success_msg', 'Logout successfully!')
  res.redirect('/users/login')
})

module.exports = router