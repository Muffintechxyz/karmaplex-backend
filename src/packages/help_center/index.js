const express = require('express')
const controller = require('./helpCenter.controller')
const router = express.Router()

module.exports = () => {
  router.post('/help-center/inquire', controller.inquire)

  return router
}
