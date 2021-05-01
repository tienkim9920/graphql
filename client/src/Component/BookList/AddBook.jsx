import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";

AddBook.propTypes = {
    authors: PropTypes.array,
    handler_AddBook: PropTypes.func
};

AddBook.defaultProps = {
    authors: [],
    handler_AddBook: null
}

function AddBook(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { authors, handler_AddBook } = props

    const [authorId, set_authorId] = useState('')

    const onSubmit = (data) => {

        const book = {
            name: data.name,
            category: data.category,
            authorId: authorId
        }

        console.log(book)

        handler_AddBook(book)

        document.getElementById('name').value = ''
        document.getElementById('category').value = ''

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
                <label htmlFor="Book">Book name: </label>
                <div>
                    <input type="text" id="name"
                        {...register('name', { required: true })}
                    />
                    {errors.name && errors.name.type === "required" && (
                        <span style={{ color: 'red', fontSize: '.8rem'}}>Book name is required!</span>
                    )}
                </div>

            </div>

            <div className="field">
                <label htmlFor="Category">Category: </label>
                <div>
                    <input type="text" id="category"
                        {...register('category', { required: true })}
                    />
                    {errors.category && errors.category.type === "required" && (
                        <span style={{ color: 'red', fontSize: '.8rem'}}>Category is required!</span>
                    )}
                </div>

            </div>

            <div className="field">
                <label htmlFor="Book">Author: </label>
                <select onChange={(e) => set_authorId(e.target.value)}>
                    <option value="null">Select Author</option>
                    {
                        authors && authors.map((author, index) => (
                            <option
                                value={author._id}
                                key={index}>
                                {author.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <button type="submit">+</button>
        </form>
    );
}

export default AddBook;