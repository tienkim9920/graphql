import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import AddBook from './AddBook';
import { GraphQLAddBook, GraphQLAuthor, GraphQLBook, GraphQLDeleteBook } from '../Queries/Queries';
import BookDetail from './BookDetail';

function BookList(props) {

    // GET list books
    const books = useQuery(GraphQLBook);

    // GET list authors
    const authors = useQuery(GraphQLAuthor)

    const [addBook] = useMutation(GraphQLAddBook)

    const [deleteBook] = useMutation(GraphQLDeleteBook)

    const [select_book, set_select_book] = useState('')

    const [select_delete, set_select_delete] = useState({
        _id: '',
        name: '',
    })

    if (books.loading || authors.loading) {
        return 'Loading...'
    }
    if (books.error || authors.error) {
        return `Error!`
    }

    const handler_AddBook = (value) => {

        addBook({
            variables: { name: value.name, category: value.category, authorId: value.authorId },
            refetchQueries: [{ query: GraphQLBook }]
        })

        set_select_delete({
            _id: '',
            name: '',
        })
    }

    const handler_Delete = () => {

        deleteBook({
            variables: { _id: select_delete._id },
            refetchQueries: [{ query: GraphQLBook }]
        })

    }

    return (
        <div className="group_grid">
            <div className="group_right">
                <h1>Reading List</h1>
                <div className="books_show" style={{ paddingTop: '1.5rem' }} >
                    {
                        books.data.books.map((value, index) => (
                            <div className="book_show" key={index} >
                                <div className="book_title d-flex">
                                    <li
                                        onClick={() => set_select_book(value._id)}
                                        data-toggle="modal" data-target="#modal"
                                    >{value.name}</li>
                                    <i
                                        onClick={() => set_select_delete({
                                            _id: value._id,
                                            name: value.name
                                        })}
                                        className="far fa-trash-alt"
                                        data-toggle="modal" data-target="#modaldelete"
                                    >
                                    </i>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="modal_book_response">
                    <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Detail Book</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <BookDetail selectBook={select_book} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modaldelete" tabIndex="-1" role="dialog" aria-labelledby="modaldelete" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Information</h5>
                            </div>
                            <div className="modal-body">
                                Do You Want To Delete Book {select_delete.name}?
                            </div>
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={handler_Delete}>Yes</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="group_left">
                <BookDetail selectBook={select_book} />
            </div>

            <AddBook authors={authors.data.authors} handler_AddBook={handler_AddBook} />

        </div>
    );
}

export default BookList;