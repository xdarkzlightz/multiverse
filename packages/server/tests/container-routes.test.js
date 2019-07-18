const request = require('supertest')
const app = require('../src/')

const BASE_URL = '/api/containers'

describe(`GET ${BASE_URL}`, () => {
  it('should return status code 200', done => {
    request(app)
      .get(BASE_URL)
      .expect(200, done)
  })
})

describe(`POST ${BASE_URL}`, () => {
  it('should return status code 201', done => {
    request(app)
      .post(BASE_URL)
      .expect(201, done)
  })
})

describe(`DELETE ${BASE_URL}/:id`, () => {
  it('should return status code 204', done => {
    request(app)
      .delete(`${BASE_URL}/123456789`)
      .expect(204, done)
  })
})

describe(`POST ${BASE_URL}/:id/stop`, () => {
  it('should return status code 204', done => {
    request(app)
      .post(`${BASE_URL}/123456789/stop`)
      .expect(204, done)
  })
})

describe(`POST ${BASE_URL}/:id/kill`, () => {
  it('should return status code 204', done => {
    request(app)
      .post(`${BASE_URL}/123456789/kill`)
      .expect(204, done)
  })
})

describe(`POST ${BASE_URL}/:id/start`, () => {
  it('should return status code 204', done => {
    request(app)
      .post(`${BASE_URL}/123456789/start`)
      .expect(204, done)
  })
})

describe(`POST ${BASE_URL}/:id/remove`, () => {
  it('should return status code 204', done => {
    request(app)
      .delete(`${BASE_URL}/123456789/`)
      .expect(204, done)
  })
})
