// Hoitaa "blogien" lisäämisen ja muokkaamisen tietokannassa

const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response,next) => {
  try{
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  }catch(error){
    next(error)
  }
})

blogsRouter.get('/:id',async (request,response) => {
  const blogToShow= await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  response.json(blogToShow)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const _user = request.user
  console.log("user information straight from request", _user)
  //const decodedToken = jwt.verify(request.token,process.env.SECRET)
  //console.log(decodedToken.user_id)
  console.log("token:" , request.token)
  if(!request.token || !_user){
    return response.status(401).json({ error: 'invalid token' })
  }

  console.log('this is the body',body)
  //const user_info = await User.findById(decodedToken.user_id)

  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes || 0,
    blog_id:body.id,
    user: _user
  })
  console.log('this is the blog' , blog)
  try{
    const savedBlog = await blog.save()
    _user.blogs = _user.blogs.concat(savedBlog._id)
    await _user.save()
    response.status(201).json(savedBlog)
  }catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id',async (request,response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  const userLoggedIn = request.user
  console.log("user info with userExtractor", userLoggedIn)
  //const decodedToken = jwt.verify(request.token,process.env.SECRET)
  console.log("BLOG USER ID HERE!! : ", blogToDelete)
  if(blogToDelete.user.toString() === userLoggedIn._id.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  else{
    return response.status(401).json({ error: 'invalid token' })
  }  
})

blogsRouter.put('/:id',async (request,response, next) => {
  try{
  const id = request.params.id
  console.log("ID is here:" , id)
  const blogByID = await Blog.findById(id)
  blogByID.likes = blogByID.likes+1
  console.log("newBlog : " , blogByID)

  const updatedBlog = await Blog.findByIdAndUpdate(id,blogByID,{ new:true }).populate('user', { username: 1, name: 1 })
      response.json(updatedBlog)
      console.log("the updated blog in cotrollers : ", updatedBlog)
  }catch(error){
    next(error)
  }
})


module.exports = blogsRouter