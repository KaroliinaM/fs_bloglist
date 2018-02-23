const supertest=require('supertest')
const {app, server}=require('../index')
const api=supertest(app)
const Blog=require('../models/blog')
const helper=require('./test_helper')

describe('testing with existing bloglist', async ()=>{

  beforeAll(async () => {
    await Blog.remove({})

    const initialBlogs=helper.blogList.map(blog=> new Blog(blog))
    await Promise.all(initialBlogs.map(blog=>blog.save()))
  })

  test('all blogs are returned as json', async ()=>{
    const allBlogs= await helper.blogsInDb()

    const response= await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)


    expect(response.body.length).toBe(allBlogs.length)
    const titles=response.body.map(blog=>blog.title)
    allBlogs.forEach(blog=>{
      expect(titles).toContain(blog.title)
    })
  })
  test('get a single blog by id', async()=>{
    const initBlogs=await helper.blogsInDb()
    const blog=initBlogs[0]

    const blogById=await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)

    expect(blog.title).toEqual(blogById.body.title)

  })

  test('posting a new blog works', async() => {
    const initBlogs=await helper.blogsInDb()

    const newBlog={
      title: "uusi testiblogi",
      author: "minä",
      url: "ei urlia",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter=await helper.blogsInDb()

    const authors=blogsAfter.map(blog=>blog.author)

    expect(blogsAfter.length).toBe(initBlogs.length + 1)
    expect(authors).toContain("minä")
  })

  test('undefined likes in posted blog are saved as 0', async () => {
    const initBlogs=await helper.blogsInDb()

    const newPost={
      title: "Nolla likes",
      author: "minä",
      url: "ei urlia"
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAfter=await helper.blogsInDb()

    expect(blogsAfter.length).toBe(initBlogs.length+1)

    const latest=blogsAfter[blogsAfter.length-1]

    expect(latest.title).toBe("Nolla likes")
    expect(latest.likes).toBe(0)
  })

  test('blogs without title or url are not saved', async ()=>{
    const initBlogs=await helper.blogsInDb()

    const newPost={
      author: "ei titleä",
      url: "ei urlia"
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(400)

    const post2={
      title: "eiUrlia",
      author: "minä"
    }
    await api
      .post('/api/blogs')
      .send(post2)
      .expect(400)

    const blogsAfter=await helper.blogsInDb()

    const blogTitles=blogsAfter.map(blog=>blog.title)
    const blogAuthors=blogsAfter.map(blog=>blog.author)

    expect(blogsAfter.length).toBe(initBlogs.length)
    expect(blogTitles).not.toContain("eiUrlia")
    expect(blogAuthors).not.toContain("ei titleä")
  })
  describe('testing for deletion', async()=>{

    let blogForDeletion
    beforeAll(async ()=>{
      blogForDeletion=new Blog({
        title: "testing for deletion",
        author: "minä",
        url: "ei urlia"
      })
      await blogForDeletion.save()
    })
    test('deletion of a blog works', async ()=>{
      const initBlogs=await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogForDeletion._id}`)
        .expect(204)

      const blogsAfter=await helper.blogsInDb()

      expect(blogsAfter.length).toBe(initBlogs.length-1)
      const titles=blogsAfter.map(blog=>blog.title)
      expect(titles).not.toContain(blogForDeletion.title)

    })
  })

  afterAll(()=>{
    server.close()
  })
})
