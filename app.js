const express = require('express')
const { create } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./config/mongoose')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const routes = require('./routes/index')

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

// routes
app.use(routes)

// PORT listen
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))