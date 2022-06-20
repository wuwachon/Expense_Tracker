const express = require('express')
const { create } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

require('./config/mongoose')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const routes = require('./routes/index')
const usePassport = require('./config/passport')

const app = express()
const exphbs = create({ defaultLayout: 'main', extname: '.hbs' })
const PORT = process.env.PORT

// template engine
app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs')

// stylesheet use
app.use(express.static('public'))
// body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))
// express-session use
app.use(session({
  secret: process.env.SESSION_SECERT,
  name: 'Users',
  resave: false,
  saveUninitialized: true
}))
// passport use
usePassport(app)
// connect-flash use
app.use(flash())
// locals middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.faillogin_msg = req.flash('faillogin_msg')
  next()
})
// routes
app.use(routes)

// PORT listen
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))