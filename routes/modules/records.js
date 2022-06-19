const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

// add new record
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  res.redirect('/')
})
// edit a record
router.get('/:id/edit', async (req, res) => {
  const _id = req.params.id
  const categories = await Category.find().lean().sort('id')
  const record = await Record.findById(_id).lean()
  const recordCategory = await Category.findById(record.categoryId).lean()
  record.category = recordCategory.name
  res.render('edit', {categories, record})
})
router.put('/:id', async (req, res) => {
  const _id = req.params.id
  let record = await Record.findById(_id)
  record = Object.assign(record, req.body)
  await record.save()
  res.redirect('/')
})
// delete a record
router.delete('/:id/delete', (req, res) => {
  res.redirect('/')
})

module.exports = router