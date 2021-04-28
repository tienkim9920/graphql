const graphql = require('graphql')
const _ = require('lodash')

const Book = require("../models/book")
const Author = require("../models/author")

// Đây là những type để đặt cho field
const { GraphQLString, GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLInt, GraphQLList } = graphql 

// Xây dụng kiểu dữ liệu cho từng loại database
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
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
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
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
            resolve(parent, args) {
                return Book.find()
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
            resolve(parent, args){

                const author = Author.findOne({ _id: args._id })

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
            resolve(parent, args){

                const author = Author.findOne({ _id: args._id})

                author.name = args.name
                author.age = args.age

                return author.save()

            }
        },


        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                category: { type: GraphQLString },
                authorId: { type: GraphQLString },
            },
            resolve(parent, args){

                const book = new Book({
                    name: args.name,
                    category: args.category,
                    authorId: args.authorId
                })

                return book.save()
            }
        }
    }
})

// Render export
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})