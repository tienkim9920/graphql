const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    name: String,
    age: Number

})

const Author = mongoose.model('Author', schema, 'author')

module.exports = Author