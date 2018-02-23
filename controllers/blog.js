const blogRouter=require('express').Router()
const Blog=require('../models/blog')

blogRouter.get('/', async (request, response) => {
  blogs= await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  try{
    const body = request.body

    const blog=new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes===undefined ? 0 : body.likes
    })

    const savedBlog=await blog.save()
    response.status(201).json(savedBlog)
  } catch(er) {
    console.log(er)
    response.status(500).json({error:'something went wrong...'})
  }
})

module.exports=blogRouter
