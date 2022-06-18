const express = require('express')
const router = express.Router()

// add new record
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  res.redirect('/')
})
// edit a record
router.get('/:id/edit', (req, res) => {
  res.render('edit')
})
router.put('/:id', (req, res) => {
  res.redirect('/')
})
// delete a record
router.delete('/:id/delete', (req, res) => {
  res.redirect('/')
})

module.exports = router