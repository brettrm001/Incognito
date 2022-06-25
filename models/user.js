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

const userModel = new mongoose.Schema({
    username: reqString,
	email: reqString,
	password: reqString,
}, {
	timestamps: true
})
const name = 'users'

module.exports =
  mongoose.model[name] || mongoose.model(name, userModel, name)