module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.flash('warning_msg', '請先登入方便查看清單資料')
    res.redirect('/users/login')
  }
}