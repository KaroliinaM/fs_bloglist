const blogRouter=require('express').Router()
const Blog=require('../models/blog')
const User=require('../models/user')
const jwt=require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
  const blogs= await Blog
    .find({})
    .populate('user', {username: 1, name:1} )
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
  const body = request.body
  try{
    const decodedToken=jwt.verify(request.token, process.env.SECRET)
    console.log(request.token)

    if(!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }

    if(body.title===undefined || body.url === undefined) {
      return response.status(400).json({error: 'bad request'})
    }

    const user=await User.findById(decodedToken.id)

    const blog=new Blog({
      title: body.title,
      author: user.name,
      url: body.url,
      likes: body.likes===undefined ? 0 : body.likes,
      user:user._id
    })

    const savedBlog=await blog.save()
    console.log(user._id)
    console.log(savedBlog._id)

    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(er) {
    console.log(er)
    response.status(500).json({error:'something went wrong...'})
  }
})
blogRouter.delete('/:id', async (request, response)=>{
  try{
    const decodedToken=jwt.verify(request.token, process.env.SECRET)

    if(!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }
    const userSigned=await User.findById(decodedToken.id)
    const blog=await Blog.findById(request.params.id)
    if(!(blog.user.toString()===userSigned._id.toString())){
      return response.status(400).json({error: 'only author can remove a blog'})
    }

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
