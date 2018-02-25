const supertest=require('supertest')
const {app, server} =require('../index')
const api=supertest(app)
const User=require('../models/user')
const helper=require('./test_helper')

describe('testing with existing users', async () => {

  beforeAll( async()=>{
    await User.remove({})

    const user= new User({
      username: "testikayttaja",
      name: "eka",
      password: "salainen",
      adult: true
    })
    await user.save()
  })
    describe('when creating a user', async()=>{

    test('POST /api/users succeeds with an unique username', async () => {
      const usersBeforeOperation=await helper.usersInDb()

      const newUser={
        username: "unique",
        name: "Uusi Käyttäjä",
        password: "salainen",
        adult: false
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfter=await helper.usersInDb()

      expect(usersAfter.length).toBe(usersBeforeOperation.length + 1)
      const usernames=usersAfter.map(u=>u.username)
      expect(usernames).toContain("unique")
    })
    test('POST /app/users rejects an invalid password', async () => {
      const usersBefore=await helper.usersInDb()

      const newUser={
        username: 'invalid',
        name: 'Wrong Password',
        password:'sa'
      }
      const result=await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toBe("password is not valid")
      const usersAfter=await helper.usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length)
      const usernames=usersAfter.map(u=>u.username)
      expect(usernames).not.toContain("invalid")
    })
    test('POST /app/users username must be unique', async()=>{
      const usersBefore=await helper.usersInDb()

      const newUser= {
        username: 'testikayttaja',
        name: 'double',
        password: 'salainen',
        adult: true
      }
      const result=await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toBe("username is already taken")
      const usersAfter=await helper.usersInDb()
      expect(usersAfter.length).toBe(usersBefore.length)
      const names=usersAfter.map(u=>u.name)
      expect(names).not.toContain("double")

    })
  })

  afterAll(()=>{
    server.close()
  })
})
