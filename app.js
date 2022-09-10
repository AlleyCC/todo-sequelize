const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const routes = require('./routes')
const usePassport = require('./config/passport')

const app = express()
const PORT = 3000

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
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') 
  res.locals.warning_msg = req.flash('warning_msg') 
  next()
})


app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on https://localhost:${PORT}.`)
})