const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

// user login
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))
// user register
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', async (req, res) => {
  try {
    const {name, email, password, confirmPassword} = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) errors.push({message: '每個欄位都是必填'})
    if (password !== confirmPassword) errors.push({message: '密碼輸入不一致'})
    const user = await User.findOne({ email })
    if (user) errors.push({message: '此Email已被註冊過'})
    if (errors.length) return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({ 
      name,
      email,
      password: hash
    })
    res.redirect('/users/login')
  } catch(err) {
    console.log(err)
  }
})
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    req.flash('success_msg', '成功登出')
    res.redirect('/users/login')
  })
})

module.exports = router