const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    
    name: String,
    category: String,
    authorId: String,
    
})

const Book = mongoose.model('Book', schema, 'book')

module.exports = Book