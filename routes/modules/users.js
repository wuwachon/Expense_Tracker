const express = require('express')
const router = express.Router()

// user login
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', (req, res) => {
  res.redirect('/')
})
// user register
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router