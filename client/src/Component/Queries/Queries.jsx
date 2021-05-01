import { gql } from '@apollo/client'

const GraphQLBook = gql`
    query getBookQuery{
        books{
            _id
            name
            category
            author{
                name
                age
            }
        },
    }
`

const GraphQLAuthor = gql`
    query getAuthorQuery{
        authors{
            _id
            name
            age
            books{
              name
              category
            }
        }
    }
`

const GraphQLAddBook = gql`
    mutation AddBook($name: String!, $category: String!, $authorId: String!){
        addBook(name: $name, category: $category, authorId: $authorId){
            name
            category
            author{
                name
                age
            }
        }
    }
`

const GraphQLDetailBook = gql`
    query getDetailBook($_id: String!){
        book(_id: $_id){
            name
            category
            author{
                name
                age
            }
        }
    }
`

const GraphQLDeleteBook = gql`
    mutation DeleteBook($_id: String!){
        deleteBook(_id: $_id){
            name
            category
        }
    }
`

export { GraphQLBook, GraphQLAuthor, GraphQLAddBook, GraphQLDetailBook, GraphQLDeleteBook }