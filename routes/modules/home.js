const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record.js')

router.get('/', async (req, res) => {
  try {
    const categoryId = req.query.category
    const userId = req.user._id
    const categorySelect = await Category.findById(categoryId).lean()
    const title = categoryId? categorySelect.name : '類型'
    const categories = await Category.find().lean().sort('id')
    const recordsFind = categoryId? await Record.find({ categoryId, userId }).lean() : await Record.find({ userId }).lean()
    const records = []
    let totalAmount = 0
    await Promise.all(
      recordsFind.map(async record => {
        const categoryFind = await Category.findById(record.categoryId).lean()
        record.category = categoryFind.icon
        records.push(record)
        totalAmount += record.amount
      })
    )
    res.render('index', {totalAmount, title, categories, records})
  } catch(err) {
    console.log(err)
  }
})

module.exports = router