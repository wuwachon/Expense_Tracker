const db = require('../../config/mongoose')

const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const users = require('./users.json')
const records = require('./records.json')

db.once('open', async () => {
  await User.create(users)
  console.log('Users created')
  await Promise.all(
    records.map(async record => {
      const user = await User.findOne({ name: record.user })
      record.userId = user._id
      const category = await Category.findOne({ name: record.category })
      record.categoryId = category._id
      await Record.create(record)
    })
  )
  console.log('Records created!')
  process.exit()
})