const graphql = require('graphql')
const _ = require('lodash')

const Book = require("../models/book")
const Author = require("../models/author")

// Đây là những type để đặt cho field
const { GraphQLString, GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLInt, GraphQLList } = graphql 

// database
const books = [
    { id: "1", name: 'Tình Yêu', category: 'Romantic', authorId: '1'},
    { id: "2", name: 'Khoa Học', category: 'Science', authorId: '2'},
    { id: "3", name: 'Cuộc Sống', category: 'Life', authorId: '3'},
]

const authors = [
    { id: "1", name: 'Kim Tiền', age: 21},
    { id: "2", name: 'Quốc Toàn', age: 20},
    { id: "3", name: 'Hiếu Lương', age: 22},
]

// Xây dụng kiểu dữ liệu cho từng loại database
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        author: {   // Liên kết mối quan hệ
            type: AuthorType,
            resolve(parent, args){
                // return _.find(authors, { id: parent.authorId })
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
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, { authorId: parent.id})
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
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return _.find(books, { id: args.id })
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return _.find(authors, { id: args.id })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
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
                
                let author = new Author({
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
        }
    }
})

// Render export
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})