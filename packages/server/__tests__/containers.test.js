const request = require('supertest')
const Docker = require('dockerode')
const app = require('../src/')

const BASE_URL = '/api/containers'

const docker = new Docker()
const createContainer = async () => {
  const container = await docker.createContainer({
    Image: 'codercom/code-server',
    Labels: {
      multiverse: 'true'
    }
  })
  return container.id
}

const removeContainer = async id => {
  try {
    const container = await docker.getContainer(id)
    try {
      await container.stop()
    } catch (e) {}
    await container.remove()
  } catch (e) {}
}

afterEach(() => {
  app.close()
})

describe(`GET ${BASE_URL}`, () => {
  let containerId
  beforeEach(async () => (containerId = await createContainer()))
  afterEach(async () => removeContainer(containerId))

  it('should send an array of containers as the body', async () => {
    const response = await request(app).get(BASE_URL)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
  })
})

describe(`POST ${BASE_URL}`, () => {
  let volume
  let containerId
  beforeEach(async () => {
    volume = await docker.createVolume({
      name: 'multiverse-jest-test-volume'
    })
  })
  afterEach(async () => {
    if (!containerId) return
    await removeContainer(containerId)
    await volume.remove()
  })

  it('should create a new container', async () => {
    const response = await request(app)
      .post(BASE_URL)
      .send({
        name: 'multiverse-jest-test',
        path: volume.name
      })

    expect(response.status).toBe(201)
    expect(typeof response.body.id).toBe('string')
    expect(response.body.id.length).toBeGreaterThan(0)
    const container = await docker.getContainer(response.body.id)
    await expect(container.inspect()).resolves.not.toThrow()
    containerId = response.body.id
  })

  it('should validate the body data', async () => {
    let response = await request(app)
      .post(BASE_URL)
      .send({})

    expect(response.status).toBe(400)
    expect(response.text).toBe('name is required.')

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: ''
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('name cannot be empty.')

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: '&&&&'
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('invalid character in name (a-z A-Z .-_ only).')

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: 'a'
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('name has to be over 3 characters.')

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('name has to be under 20 characters.')

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: 3333
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe("name has to be type 'string'.")

    response = await request(app)
      .post(BASE_URL)
      .send({
        name: 'abcd'
      })

    expect(response.status).toBe(400)
    expect(response.text).toBe('path is required.')
  })

  it('should 400 if the project name already exists', async () => {
    const response = await request(app)
      .post(BASE_URL)
      .send({
        name: 'multiverse-jest-test',
        path: volume.name
      })

    const responseTwo = await request(app)
      .post(BASE_URL)
      .send({ name: 'multiverse-jest-test', path: volume.name })

    expect(responseTwo.status).toBe(400)

    await removeContainer(response.body.id)
  })
})

describe(`DELETE ${BASE_URL}/:id`, () => {
  let containerId
  beforeEach(async () => (containerId = await createContainer()))
  afterEach(async () => removeContainer(containerId))

  it('should delete a container', async () => {
    const response = await request(app).delete(`${BASE_URL}/${containerId}`)

    expect(response.status).toBe(204)
    const container = await docker.getContainer(containerId)
    await expect(container.inspect()).rejects.toThrow()
  })

  it('should validate the id', async () => {
    const response = await request(app).delete(`${BASE_URL}/535[{&[{53=(=)}]}]`)

    expect(response.status).toBe(400)
    expect(response.text).toBe(
      'Invalid URL Parameters - child "id" fails because ["id" with value "535[{&[{53=(=)}]}]" fails to match the required pattern: /^[a-z0-9]*$/]'
    )
  })

  it('should 400 if the container is running', async () => {
    const startedContainerId = await createContainer()
    const container = await docker.getContainer(startedContainerId)
    await container.start()
    const response = await request(app).delete(
      `${BASE_URL}/${startedContainerId}`
    )
    await removeContainer(startedContainerId)
    expect(response.status).toBe(400)
    expect(response.text).toBe('Cannot remove a running container.')
  })

  // For these 2 specific tests It's only for the containers/:id/* endpoints
  // This gets handled through the docker service in the DockerService.getContainer() method
  // So It'd be pointless to repeat the same code across multiple tests
  it("should 400 if the container doesn't exist", async () => {
    const response = await request(app).delete(
      `${BASE_URL}/53624635honeuhoneuh53`
    )
    expect(response.status).toBe(400)
    expect(response.text).toBe('Container does not exist.')
  })

  it('should 400 if it cannot access the container', async () => {
    const container = await docker.createContainer({
      Image: 'hello-world'
    })

    const response = await request(app).delete(`${BASE_URL}/${container.id}`)

    await container.remove()
    expect(response.status).toBe(400)
    expect(response.text).toBe(
      'Unable to access container, it was not created by multiverse.'
    )
  })
})

describe(`POST ${BASE_URL}/:id/stop`, () => {
  let containerId
  beforeEach(async () => {
    containerId = await createContainer()
    const container = docker.getContainer(containerId)
    await container.start()
  })
  afterEach(async () => removeContainer(containerId))

  it('should stop a container', async () => {
    const response = await request(app).post(`${BASE_URL}/${containerId}/stop`)

    expect(response.status).toBe(204)

    const container = await docker.getContainer(containerId)
    const details = await container.inspect()
    expect(details.State.Running).toBe(false)
  })

  it('should validate the id', async () => {
    const response = await request(app).post(`${BASE_URL}/$}({[]][}/stop`)

    expect(response.status).toBe(400)
    expect(response.text).toBe(
      'Invalid URL Parameters - child "id" fails because ["id" with value "$}({[]][}" fails to match the required pattern: /^[a-z0-9]*$/]'
    )
  })

  it('should 400 if the container is already stopped', async () => {
    const stoppedContainerId = await createContainer()
    const response = await request(app).post(
      `${BASE_URL}/${stoppedContainerId}/stop`
    )
    await removeContainer(stoppedContainerId)
    expect(response.status).toBe(400)
    expect(response.text).toBe('Container already stopped.')
  })
})

describe(`POST ${BASE_URL}/:id/kill`, () => {
  let containerId
  beforeEach(async () => {
    containerId = await createContainer()
    const container = docker.getContainer(containerId)
    await container.start()
  })
  afterEach(async () => removeContainer(containerId))

  it('should kill a container', async () => {
    const response = await request(app).post(`${BASE_URL}/${containerId}/kill`)

    expect(response.status).toBe(204)

    const container = await docker.getContainer(containerId)
    const details = await container.inspect()
    expect(details.State.Running).toBe(false)
  })

  it('should validate the id', async () => {
    const response = await request(app).post(`${BASE_URL}/]+*+)/kill`)

    expect(response.status).toBe(400)
    expect(response.text).toBe(
      'Invalid URL Parameters - child "id" fails because ["id" with value "]+*+)" fails to match the required pattern: /^[a-z0-9]*$/]'
    )
  })

  it('should 400 if the container is already stopped', async () => {
    const stoppedContainerId = await createContainer()
    const response = await request(app).post(
      `${BASE_URL}/${stoppedContainerId}/kill`
    )
    await removeContainer(stoppedContainerId)
    expect(response.status).toBe(400)
    expect(response.text).toBe('Container already stopped.')
  })
})

describe(`POST ${BASE_URL}/:id/start`, () => {
  let containerId
  beforeEach(async () => (containerId = await createContainer()))
  afterEach(async () => removeContainer(containerId))

  it('should start a container', async () => {
    const response = await request(app).post(`${BASE_URL}/${containerId}/start`)

    expect(response.status).toBe(204)

    const container = await docker.getContainer(containerId)
    const details = await container.inspect()
    expect(details.State.Running).toBe(true)
  })

  it('should validate the id', async () => {
    const response = await request(app).post(`${BASE_URL}/}({!++/start`)

    expect(response.status).toBe(400)
    expect(response.text).toBe(
      'Invalid URL Parameters - child "id" fails because ["id" with value "}({!++" fails to match the required pattern: /^[a-z0-9]*$/]'
    )
  })

  it('should 400 if the container is already started', async () => {
    const startedContainerId = await createContainer()
    const container = await docker.getContainer(startedContainerId)
    await container.start()
    const response = await request(app).post(
      `${BASE_URL}/${startedContainerId}/start`
    )
    await removeContainer(startedContainerId)
    expect(response.status).toBe(400)
    expect(response.text).toBe('Container already started.')
  })
})
