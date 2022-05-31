const express = require('express')
const controller = require('./NFTDetails.controller')
const router = express.Router()

module.exports = () => {
  router.post('/create', controller.createNFTDetails)
  router.get('/get/:id', controller.getNFTDetails)
  return router
}
