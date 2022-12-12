import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import ShowLoginForm from './components/ShowLoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeStyle, setMessageStyle] =  useState(null)

  useEffect(() => {
    blogService.getAll().then(_blogs =>
      sortBylikes(_blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const sortBylikes = (blogsToSet) => {
    const _blogs = [...blogsToSet]
    _blogs.sort((a,b) => b.likes-a.likes)
    setBlogs(_blogs)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      console.log(username, password)
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      console.log(window.localStorage)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageStyle('red')
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedUser')
    window.location.reload(false)
  }

  const handleCreate = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService.createNewBlog(newBlog)
      .then(r => setBlogs(blogs.concat(r)))
    setErrorMessage(`added a new blog called ${newBlog.title} by ${newBlog.author}`)
    setMessageStyle('green')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleAddLike = async (blogToEdit) => {
    console.log('in app : ', blogToEdit)
    blogToEdit.likes = blogToEdit.likes+1
    console.log('after adds: ', blogToEdit)
    const resp = await blogService.addLike(blogToEdit)
    const arrIndex = blogs.findIndex(b => b.blog_id===blogToEdit.blog_id)
    console.log('arrIndex: ', arrIndex)
    const copyOfBlogs = [...blogs]
    copyOfBlogs[arrIndex] = resp
    copyOfBlogs.sort((a,b) => b.likes-a.likes)
    console.log('the copy of blogs: ', copyOfBlogs)
    setBlogs(copyOfBlogs)
  }

  const handleDelete = async (blogToDelete) => {
    if(window.confirm(`do you really want to delete blog ${blogToDelete.title}?`)){
      const resp = await blogService.deleteBlog(blogToDelete)
      console.log(resp.data)
      const _blogs = await blogService.getAll()
      sortBylikes(_blogs)
    }
  }


  const showBlogs = () => (
    <div>
      <h2>list of blogs</h2>
      {blogs.map(blog => <Blog key={blog.blog_id} loggedUsername = {user.username} blog={blog} addLikeFunc={handleAddLike} deleteFunc={handleDelete}/>)}
      <Togglable buttonLabel ='new blog' ref={blogFormRef}>
        <BlogForm createBlog={handleCreate}/>
      </Togglable>
    </div>

  )

  return (
    <div>
      <h1>Blogs</h1>
      {user === null ?
        <div><ShowLoginForm handleLogin={handleLogin} handleChangeUsername ={({ target }) => setUsername(target.value)}
          handleChangePassword ={({ target }) => setPassword(target.value)}
          username={username} password={password}/> </div>:
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {showBlogs()}
        </div>
      }
      <Notification message={errorMessage} classType = {activeStyle}/>
    </div>
  )
}

export default App
