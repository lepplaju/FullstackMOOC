import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('creating a blog with correct information', async () =>{
    const user = userEvent.setup()
    const mockFunc = jest.fn()

    const {container} = render(<BlogForm createBlog={mockFunc}/>)
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const urlInput = container.querySelector('#url')
    const saveButton = screen.getByText('create')
    await userEvent.type(titleInput, 'Otsikko')
    await userEvent.type(authorInput, 'Tekija')
    await userEvent.type(urlInput, 'Webbisivu')
    fireEvent.click(saveButton)
    console.log(mockFunc.mock.calls)
    expect(mockFunc.mock.calls).toHaveLength(1)
    expect(mockFunc.mock.calls[0][0].title).toBe('Otsikko')
    expect(mockFunc.mock.calls[0][0].author).toBe('Tekija')
    expect(mockFunc.mock.calls[0][0].url).toBe('Webbisivu')
})