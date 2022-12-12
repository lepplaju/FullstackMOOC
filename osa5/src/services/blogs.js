import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNewBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  console.log('this is the response data : ', response.data)
  return response.data
}

const addLike = async (blogObj) => {
  console.log('theBlogObj: ' , blogObj)
  const response = await axios.put(`${baseUrl}/${blogObj.blog_id}`, blogObj)
  console.log('response: ', response.data)
  return response.data
}

const deleteBlog = async (blogObj) => {
  console.log(token)
  const config = {
    headers: { Authorization: token },
  }
  console.log('theBlogObj: ' , blogObj)
  const response = await axios.delete(`${baseUrl}/${blogObj.blog_id}`, config)
  console.log(response)
  return response.data
}

export default { getAll, setToken, createNewBlog, addLike, deleteBlog }