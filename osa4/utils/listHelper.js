// Tämä tiedosto sisältää "totallikes.test.js"-tiedoston sisältämien testien aliohjelmat

const dummy = (blogs) =>{
return 1
}

const totalLikes = (blogs) => {
  const blogLikes= blogs.map(blog => blog.likes)
  const initialVal = 0
  const returnVal = blogLikes.reduce(
    (previous, current) => previous + current, initialVal
  )
  return returnVal
}

const favoriteBlog = (blogs) => {
  const likesList = blogs.map(blog => blog.likes)
  const indexWithMostLikes = likesList.indexOf(Math.max(...likesList))
  console.log(likesList)
  console.log(indexWithMostLikes)
  return blogs[indexWithMostLikes]
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  const count = authors.reduce((acc,val) => {
    return { ...acc,[val]: (acc[val]||0)+1 }
  },{})
  console.log(count)
  const values = Object.entries(count)
  console.log(values)
  const authorWithMost = values.reduce((a,b) => count[a]>count[b]? a:b)
  return authorWithMost
}

const mostLikes = (blogs) => {
  console.log(blogs)
  const authorsAndLikes = blogs.reduce((acc,blog) => {
    const key = blog.author
    const likes = blog.likes
    console.log(key,likes)
    console.log(acc)
    return { ...acc, [key]:(acc[key]||0)+ likes }
  },{})
  console.log(authorsAndLikes)
  const authorWithMost = (Object.entries(authorsAndLikes)).reduce((a,b) => authorsAndLikes[a]>authorsAndLikes[b]?a:b)
  return authorWithMost
}

module.exports = {
  dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
}