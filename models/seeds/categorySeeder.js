const db = require('../../config/mongoose')

const Category = require('../category')
const categories = require('./category.json')

db.once('open', async () => {
  await Category.create(categories)
  console.log('Categories created!')
  process.exit()
})
