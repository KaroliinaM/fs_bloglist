const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog=require('./models/blog')
const middleware=require('./utils/middleware')
const blogRouter=require('./controllers/blogs')
const config=require('./utils/config')
const usersRouter=require('./controllers/users')
const loginRouter=require('./controllers/login')

mongoose.Promise = global.Promise
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)


app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)

app.use(cors())

mongoose
  .connect(config.mongoUrl)
  .then( ()=>{
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err=>{
    console.log(err)
  })



const server=http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', ()=>{
  mongoose.connection.close()
})

module.exports={
  app, server
}
