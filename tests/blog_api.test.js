const supertest=require('supertest')
const {app, server}=require('../index')
const api=supertest(app)
const Blog=require('../models/blog')

const blogList=[
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const initialBlogs=blogList.map(blog=> new Blog(blog))
  const promiseArray= initialBlogs.map(blog=>blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async ()=>{
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('amount of blogs and the content', async ()=>{
  const blogs=await api
    .get('/api/blogs')

  const titles=blogs.body.map(blog=>blog.title)

  expect(blogs.body.length).toBe(6)
  expect(titles).toContain("TDD harms architecture")
})

test('posting a new blog works', async() => {

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

  const blogContentAfter= await api
    .get('/api/blogs')

  const blogsAfter=blogContentAfter.body.map(blog=>blog.author)

  expect(blogContentAfter.body.length).toBe(blogList.length + 1)
  expect(blogsAfter).toContain("minä")

})

afterAll(()=>{
  server.close()
})
