const graphql = require('graphql')
const _ = require('lodash')

const Book = require("../models/book")
const Author = require("../models/author")

// Đây là những type để đặt cho field
const { GraphQLString, GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql 

// Xây dụng kiểu dữ liệu cho từng loại database
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        author: {   // Liên kết mối quan hệ
            type: AuthorType,
            resolve(parent, args){
                return Author.findOne({ _id: parent.authorId })
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorId: parent._id })
            }
        }
    })
})

// Xây dựng phương thức query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { _id: { type: GraphQLString } },
            resolve(parent, args){
                return Book.findOne({ _id: args._id })
            }
        },
        author: {
            type: AuthorType,
            args: { _id: { type: GraphQLString } },
            resolve(parent, args){
                return Author.findOne({ _id: args._id })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args) {

                const books = await Book.find()

                const reverse = books.reverse()

                return reverse
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find()
            }
        }
    }
})


// Xây dựng phương thức xử lý queries
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                
                const author = new Author({
                    name: args.name,
                    age: args.age
                })
                
                return author.save()

            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {
                _id: { type: GraphQLString }
            },
            async resolve(parent, args){

                const author = await Author.findOne({ _id: args._id })

                return author.delete()

            }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                _id: { type: GraphQLString },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            async resolve(parent, args){

                const author = await Author.findOne({ _id: args._id})

                author.name = args.name
                author.age = args.age

                return author.save()

            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){

                const book = new Book({
                    name: args.name,
                    category: args.category,
                    authorId: args.authorId
                })

                return book.save()
            }
        },

        deleteBook: {
            type: BookType,
            args: {
                _id: { type: GraphQLString }
            },
            async resolve(parent, args){

                const book = await Book.findOne({ _id: args._id })
                
                return book.delete()
            }
        }
    }
})

// Render export
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})