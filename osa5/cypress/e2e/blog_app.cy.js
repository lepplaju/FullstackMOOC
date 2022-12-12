//Testaamista cypressin avulla.
// Testien toimintaa edellyttää, että sovelluksen backend ja frontend ovat käynnissä.

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Testaaja',
      username: 'MrTester',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

//  it('Login form is shown', function() {
//    cy.contains('Log in to application')
//  })

  describe('when logged in', function(){
    beforeEach(function() {
      cy.login({username:'MrTester',password:'salasana'})
    })
    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A new chapter')
      cy.get('#author').type('BlogAuthor')
      cy.get('#url').type('www.fi')
      cy.get('#createBlog').click()
    })
    describe('A new blog can be viewed', function() {
      beforeEach(function() {
        cy.createBlog({
          title:'A blog to test with',
          author:'BlogAuthor',
          url:'www.fakewebsite.com',
        })
      })
    it('a blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1').click()
    })
    it('A blog can be deleted', function() {
      cy.get('html').should('contain', 'BlogAuthor')
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.on('window:confirm', () => true);
      cy.get('html').should('not.contain', 'BlogAuthor')
    })
  })
  describe('multiple blogs are in order based on likes', function() {
    beforeEach(function() {
    cy.createBlog({title:'A blog to test with',       author:'BlogAuthor',        url:'www.fakewebsite.com',})
    cy.createBlog({title:'Another blog to test with', author:'SecondBlogAuthor',  url:'www.Anotherfakewebsite.com',})
    cy.createBlog({title:'Third blog to test with',   author:'ThirdBlogAuthor',   url:'www.Thirdfakewebsite.com',})
    })
    it('liking different blogs', function() {
      cy.contains('Third blog to test with').contains('view').click()
      cy.contains('Thirdfakewebsite').parent().find('button').then(buttons =>{
        cy.wrap(buttons[1]).click()
        cy.wrap(buttons[1]).click()
      })
      cy.contains('Another blog to test with').contains('view').click()
      cy.contains('Anotherfakewebsite').parent().find('button').then(buttons =>{
        cy.wrap(buttons[1]).click()
      })
      cy.contains('A blog to test with').contains('view').click()

      cy.get('.hiddenBlogInfo').eq(0).should('contain', 'Third blog to test with')
      cy.get('.hiddenBlogInfo').eq(0).should('contain', 'likes: 2')
      cy.get('.hiddenBlogInfo').eq(1).should('contain', 'Another blog to test with')
      cy.get('.hiddenBlogInfo').eq(1).should('contain', 'likes: 1')
    })
  })
})
  describe('Login',function(){
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('MrTester')
      cy.get('#password').type('salasana')
      cy.contains('Login').click()
  
      cy.contains('Testi Testaaja logged in')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type('incorrect')
      cy.get('#password').type('incorrect')
      cy.contains('Login').click()
  
      cy.contains('wrong username or password')
    })
  })
})