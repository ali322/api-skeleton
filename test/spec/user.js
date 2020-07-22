const createApp = require('../../dist/app').default
const Koa = require('koa')
const request = require('supertest')
const qs = require('qs')
const expect = require('chai').expect

const token = 'abc'

describe.only('user', () => {
  let id = 0
  let agent
  let conn
  before(async () => {
    process.env.NODE_ENV = 'test'
    let app = await createApp()
    agent = await request(app.listen())
  })
  it('create', async () => {
    const ret = await agent
      .post('/api/v1/public/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nickname: 'test',
        username: 'test',
        id: 'bbc',
        email: 'test@email.com',
        avatar: ''
      })
    expect(ret.status).to.equal(201)
    expect(ret.body.code).to.equal(0)
    id = ret.body.data.id
  })
  it('update', async () => {
    const ret = await agent
      .put(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: 'test2' })
    expect(ret.status).to.equal(201)
    expect(ret.body.code).to.equal(0)
  })
  it('find one', async () => {
    const ret = await agent
      .get(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(ret.status).to.equal(200)
    expect(ret.body.code).to.equal(0)
  })
  it('find all', async () => {
    const q = qs.stringify({
      page: 1,
      limit: 10,
    })
    const ret = await agent
      .get(`/api/v1/public/user?${q}`)
      .set('Authorization', `Bearer ${token}`)
    expect(ret.status).to.equal(200)
    expect(ret.body.code).to.equal(0)
  })
})
