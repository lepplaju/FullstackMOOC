import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, screen, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows only title and author', async () => {
  const blog = {
    title: 'renderöintiä',
    author: "jare",
    url: "www.fi",
    likes: 10,
    user:{
        name:"Jari Kurry",
        username:"jartsa"
    }
  }
  const mockHandler = jest.fn()

  const {container} =  render(<div><p>hellou</p>
  <Blog blog={blog} loggedUsername = 'jartsa'/>
  </div>)
  const _visible = container.querySelector('.blogInfo')
  expect(_visible).toHaveTextContent(`${blog.title} - ${blog.author}`)
  expect(_visible).not.toHaveTextContent(`${blog.url} likes: ${blog.likes}`)
  screen.debug(_visible)
})

  test('shows all infromation after pressing button', async () =>{
    const mockHandler = jest.fn()

    const blog = {
      title: 'button pressin 101',
      author: "jare",
      url: "www.azb.com",
      likes: 10,
      user:{
          name:"Jari Kurry",
          username:"jartsa"
      }
    }
    const {container} = render(<Blog blog={blog} loggedUsername = 'jartsa'/>)
    const button = screen.getByText('view')
    const allBlogInfo = container.querySelector('.hiddenBlogInfo')
    expect(allBlogInfo).toHaveStyle('display: none')
    fireEvent.click(button)
    expect(allBlogInfo).not.toHaveStyle('display: none')
    screen.debug()
    //expect hiddenBlogInfo toHaveStyle('')
  })

  test('Like button testing', async () =>{
    const mockHandler = jest.fn()

    const blog = {
      title: 'adding likes 101',
      author: "jare",
      url: "www.xzy.com",
      likes: 99,
      user:{
          name:"Jari Kurry",
          username:"jartsa"
      }
    }
    const {container} = render(<Blog blog={blog} loggedUsername = 'jartsa' addLikeFunc ={mockHandler}/>)
    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = screen.getByText('like')
    screen.debug(likeButton)
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
    screen.debug()
  })
  //
  //const _visible = container.querySelector('.blogInfo')
  //const _hidden = container.querySelector('.hiddenBlogInfo')
  //expect(_visible).toHaveTextContent('kuinka testataan')
  //expect(_visible).toHaveTextContent('jare')
  //expect(_visible).not.toHaveTextContent('www.fi')
  //expect(_visible).not.toHaveTextContent('likes:')
  //expect(_hidden).toHaveTextContent('kuinka testataan')
  //expect(_hidden).toHaveTextContent('jare')
  //expect(_hidden).toHaveTextContent('www.fi')
  //expect(_hidden).toHaveTextContent('likes: 10')
//
  //const _user = userEvent.setup()
  //const button = screen.getByText('view')
  //screen.debug(button)
  //await _user.click(button)
  //expect(mockHandler.mock.calls).toHaveLength(1)
//
  //expect(_element).toBeDefined()
//
  