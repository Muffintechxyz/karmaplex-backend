const express = require('express')
const controller = require('./Tags.controller')
const router = express.Router()

module.exports = () => {
  router.get('/tags/get', controller.getTags)
  router.get('/tags/get/:id', controller.getTag)
  return router
}