// Blogisovelluksen toiminnan testaaminen
// Testit toimivat myös autentikaation lisäämisen jälkeen

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')


describe('testing on Blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('objects are returned as json - supertest', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  })

  test('return all blogs - supertest', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog title amongst blogs is returned - supertest', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'Go To Statement Considered Harmful'
    )
  })

  test('id field is defined - supertest', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(r => r.blog_id)
    console.log(ids)
    expect(ids[0]).toBeDefined()
  })

  test('adding new blogs and testing that undefinded likes value goes to 0 - supertest', async () => { // tarkistetaan myös, ettei mene ilman auktorisointia läpi
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('myPassword',8)
    const user = new User({ username:'TestAdmin',passwordHash })
    await user.save()

    const response = await api.post('/api/login')
    .send({username:'TestAdmin',password:'myPassword'})
    .expect(200)

    console.log("login response:", response.body)
    const newBlog = {
      title: 'Lisatty blogi',
      author:'Jussi',
      url: 'testi.com'
    }

    await api.post('/api/blogs')
    .send(newBlog)
    .expect(401) // ei ole tokenia, ei mene läpi

    console.log(user)
    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + response.body.token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)
    console.log(blogsAtEnd)
    expect(blogsAtEnd[helper.initialBlogs.length].likes).toEqual(0) // Tarkistetaan, että jos lisätylle muisitinpanolle
    // ei anneta tykkäyksien arvoa, arvo laitetaan automaattisesti nollaksi
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Lisatty blogi')
  })

  test('adding a blog without propper information fails - supertest', async () => { // ei mene auktorisoinnin jälkeen läpi
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('myPassword',8)
    const user = new User({ username:'TestAdmin',passwordHash })
    await user.save()

    const response = await api.post('/api/login')
    .send({username:'TestAdmin',password:'myPassword'})
    .expect(200)

    const newBlog2 = {
      title: 'This has missing information',
      author:'Jussi',
      likes: 99
    }

    await api.post('/api/blogs')
      .send(newBlog2)
      .set('Authorization', 'bearer ' + response.body.token)
      .expect(400) // Tarkistaa ettei puuttuvilla tiedoilla olevaa blogia lisätä listalle

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deleting a blog',async () => { // Toimii vain jos blogin poistaa sen lisännyt käyttäjä
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('myPassword',8)
    const user = new User({ username:'TestAdmin',passwordHash })
    await user.save()

    const response = await api.post('/api/login')
    .send({username:'TestAdmin',password:'myPassword'})
    .expect(200)

    // Lisätään ensin uusi blogi, joka poistetaan heti lisäämisen jälkeen
    const blogToDelete = {
      title: 'blog to delete',
      author:'Marko',
      url: 'testi.com',
      likes: 0
    }
    await api.post('/api/blogs')
      .send(blogToDelete)
      .set('Authorization', 'bearer ' + response.body.token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()

    expect(blogsAtStart).toHaveLength(helper.initialBlogs.length+1)

    const blogToDeleteFromDb =blogsAtStart[3]
    console.log("blog to delete: ", blogToDeleteFromDb)

    await api.delete(`/api/blogs/${blogToDeleteFromDb.blog_id}`)
      .send()
      .set('Authorization', 'bearer ' + response.body.token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('modifying a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToModify = JSON.parse(JSON.stringify(blogsAtStart[1]))
    blogToModify.likes = blogToModify.likes +1

    console.log(blogsAtStart[1])

    console.log(blogToModify)

    await api.put(`/api/blogs/${blogToModify.blog_id}`) // muutokset blogiin täytyy tehdä tämän jälkeen
      .send(blogToModify)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[1].likes).toBe(blogsAtStart[1].likes+1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogsAtStart[1].title)
    console.log(blogsAtEnd)
  })
})

describe('Testing on Users - Creating the initial user database for testing', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('myPassword',8)
    const user = new User({ username:'admin',passwordHash })
    await user.save()
  })

  test('trying to create a user with a too short password fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'user12',
      name: 'Random Randomiser',
      password: 'as'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('Creating a new user successfully', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'user123',
      name: 'Frank Frankenstein',
      password: 'myPassword123',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})