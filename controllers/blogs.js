const blogsRouter = require('express').Router()
const { use } = require('bcrypt/promises')
const Blog = require('../models/blog')
const User = require('../models/user')
const { usersInDb } = require('../tests/test_helper')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
    .then(blog => {
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const user = await User.findOne()
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})
  
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
  
blogsRouter.put('/:id', (request, response, next) => {
const body = request.body

const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
}

Blog.findByIdAndUpdate(request.params.id, blog)
    .then(updatedBlog => {
    response.json(updatedBlog)
    })
    .catch(error => next(error))
})
  
module.exports = blogsRouter