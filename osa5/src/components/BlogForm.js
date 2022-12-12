import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = (props) => {

  const [title, setTitle] =useState('')
  const [author, setAuthor] =useState('')
  const [url, setUrl] =useState('')

  const handleCreateBlog = (event) => {
    event.preventDefault()
    props.createBlog({
      title:title,
      author:author,
      url:url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input type="text"
            id='title'
            name='Title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input type="text"
            id='author'
            name='Author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input type="text"
            id='url'
            name='Url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id='createBlog' className='customButton' type='Submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm