const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (app) => {
  // initialize
  app.use(passport.initialize())
  app.use(passport.session())
  // Strategies
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) return done(null, false, req.flash('faillogin_msg', '此Email沒有被註冊過'))
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return done(null, false, req.flash('faillogin_msg', '帳號或密碼不正確'))
        return done(null, user)
      } catch(err) {
        done(err, false)
      }
    }
  ))
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['displayName', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json
        const userFind = await User.findOne({ email })
        if (userFind) return done(null, userFind)
        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        const user = await User.create({
          name,
          email,
          password: hash
        })
        return done(null, user)
      } catch(err) {
        done(err, false)
      }
    }
  ))
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      profileFields: ['displayName', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json
        const userFind = await User.findOne({ email })
        if (userFind) return done(null, userFind)
        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        const user = await User.create({
          name,
          email,
          password: hash
        })
        return done(null, user)
      } catch(err) {
        done(err, false)
      }
    }
  ))
  // Serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch(err) {
      done(err, false)
    }
  })
}