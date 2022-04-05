const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added ', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const newBlog = {
    title: 'Uuden esimerkkiblogin title',
    author: 'BLogin kirjoittaja',
    url: 'www.uusiblogi.com',
    likes: 87,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContainEqual(
    'Uuden esimerkkiblogin title'
  )

})

afterAll(() => {
  mongoose.connection.close()
})