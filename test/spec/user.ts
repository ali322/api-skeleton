import createApp from '../../src/app'
import test from 'ava'
import * as supertest from 'supertest'

let agent:supertest.SuperAgentTest 
test.before(async t => {
  const app = await createApp()
  agent = supertest.agent(app.listen())
  // .set('Accept', 'application/json')
})

test('find all user',  async (t) => {
  const ret = await agent.get('/api/v1/public/user')
  .set('Accept', 'application/json')
  t.is(ret.status, 200)
})

test('create user', async t=> {
  const ret = await agent.post('/api/v1/public/user')
  .set('Accept', 'application/json')
  .send({
    nickname: 'test',
    username: 'test',
    id: 'bbc',
    email: 'test@email.com',
    avatar: ''
  })
  t.is(ret.status, 201)
})