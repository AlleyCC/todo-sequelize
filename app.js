const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000

app.engine('hbs', engine( {defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//home
app.get('/', (req, res) => {
  res.send('hello world')
})

//login
app.get('/users/login', (req, res)=> {
  res.render('login')
})

app.post('/users/login', (req, res)=> {
  res.send('sending login request.')
})

//register
app.get('/users/register', (req, res)=> {
  res.render('register')
})

app.post('/users/register', (req, res)=> {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => {
      res.redirect('/')
    }) 
})

app.listen(PORT, () => {
  console.log(`App is running on https://localhost:${PORT}.`)
})