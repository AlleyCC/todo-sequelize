const express = require('express')
const app = express()
const session = require('express-session')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const PORT = 3000
const usePassport = require('./config/passport')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', engine( {defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')


app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: true
}))


app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
//home
app.get('/', (req, res) => {
  return Todo.findAll({    //{raw: true, nest: true}: 傳入參數將資料轉換成plain object並排除不需要的資料
    raw: true,
    nest: true
  })
    .then(todos => {
      res.render('index', { todos })
    })
    .catch(err => { return res.status(422).json(err) })
})

//detail
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => {
      return res.render('detail', { todo: todo.toJSON() }) //.toJSON(): 將資料轉換成plain object
    })
    .catch(err => console.log(err))
})

//login
app.get('/users/login', (req, res)=> {
  res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/'
}))

//register
app.get('/users/register', (req, res)=> {
  res.render('register')
})

app.post('/users/register', (req, res)=> {
  const { name, email, password, confirmPassword } = req.body
  return User.findOne({ where: { email }})
    .then(user => {
      if (user) {
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword
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
    .catch(err => console.log(err))
  }) 
})

app.listen(PORT, () => {
  console.log(`App is running on https://localhost:${PORT}.`)
})