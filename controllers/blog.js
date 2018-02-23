const blogRouter=require('express').Router()
const Blog=require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs= await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response)=>{
  try{
    const blog=await Blog.findById(request.params.id)
    if(blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch(er) {
    console.log(er)
    response.status(400).send({error: 'malformatted id'})
  }
})

blogRouter.post('/', async (request, response) => {
  try{
    const body = request.body

    if(body.title===undefined || body.url === undefined) {
      return response.status(400).json({error: 'bad request'})
    }

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
blogRouter.delete('/:id', async (request, response)=>{
  try{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch(er){
    console.log(er)
    response.status(400).json({error:'malformatted id'})
  }
})

blogRouter.put('/:id', async (request, response) => {
  try {
    const body=request.body
    const blog={
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog=await Blog.findByIdAndUpdate(request.params.id, blog, {new:false})
    response.json(updatedBlog)

  } catch(er){
    console.log(er)
    response.status(400).json({error: 'malformatted id'})
  }
})


module.exports=blogRouter
