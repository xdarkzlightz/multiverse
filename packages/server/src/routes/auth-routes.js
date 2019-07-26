const Router = require('koa-router')
const ctl = require('../controllers/auth-controller')

const router = new Router()
const BASE_URL = '/api/auth'

// Log into multiverse
router.post(`${BASE_URL}/login`, ctl.login)

module.exports = router
