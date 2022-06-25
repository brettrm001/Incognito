//
const mongoose = require('mongoose')
const reqString = {
  type: String,
  required: true,
}
const reqNumber = {
    type: Number,
    required: true
}
//

const nameModel = new mongoose.Schema({
    type: reqString,
    number: reqNumber
})
const name = 'Name'

module.exports =
  mongoose.model[name] || mongoose.model(name, nameModel, name)