import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { GraphQLDetailBook } from '../Queries/Queries';

BookDetail.propTypes = {
    selectBook: PropTypes.string
};

BookDetail.defaultProps = {
    selectBook: ''
}

function BookDetail(props) {

    const { selectBook } = props

    const book = useQuery(GraphQLDetailBook, { variables: { _id: selectBook } })

    if (book.loading) {
        return null
    }
    if (book.error) {
        return <div className="group_detail">
            <h3>You haven't choose book!</h3>
        </div>
    }

    return (
        <div className="group_detail">
            <div className="book_detail">
                <span className="title_book">Name: </span>
                <span className="content_book">{book.data.book.name}</span>
            </div>
            <div className="book_detail">
                <span className="title_book">Category: </span>
                <span className="content_book">{book.data.book.category}</span>
            </div>
            <div className="book_detail">
                <span className="title_book">Author:</span>
                <li>{book.data.book.author.name}</li>
                <li>{book.data.book.author.age} age</li>
            </div>
        </div>
    );
}

export default BookDetail;