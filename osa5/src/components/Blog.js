import { useState } from 'react'
const Blog = (props) => {

  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async (blogToEdit) => {
    console.log('loggin the blog:' , blogToEdit)
    props.addLikeFunc(blogToEdit)
  }

  const deleteBlog = async (blogToDelete) => {
    console.log('blogTodelete: ', blogToDelete)
    props.deleteFunc(blogToDelete)
  }
  const deleteButton = () => {
    if(props.blog.user.username === props.loggedUsername){
      return(<button onClick={() => deleteBlog(props.blog)}>remove</button>)
    }
    return (
      <div></div>
    )
  }

  return (
    <div>
      <div style={hideWhenVisible} className="blogInfo">
        {props.blog.title} - {props.blog.author}
        <button className="customButton1" onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="hiddenBlogInfo">
        {props.blog.title} - {props.blog.author}  <button className="customButton1" onClick={toggleVisibility}>hide</button>
        <p>{props.blog.url}</p> <p>likes: {props.blog.likes} <button className="customButton1" onClick={() => addLike(props.blog)}>like</button></p><p>{props.blog.user.name}</p>
        {deleteButton()}
      </div>
    </div>
  )


}


export default Blog