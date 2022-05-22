const express = require('express')
const controller = require('./AuctionHouse.controller')
const router = express.Router()

module.exports = () => {
  router.post('/ah/create', controller.createAuctionHouse)
  router.get('/ah/get/:id', controller.getAuctionHouse)
  router.get('/ah/get', controller.getAuctionHouse)

  return router
}
