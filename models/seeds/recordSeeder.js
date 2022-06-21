const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')

const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const users = require('./users.json')
const records = require('./records.json')

db.once('open', async () => {
  try {
    await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        await User.create({
          name: user.name,
          email: user.email,
          password: hash
        })
      })
    )
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
  } catch(err) {
    console.log(err)
  }
})