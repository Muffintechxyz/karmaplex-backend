const express = require('express')
const controller = require('./AuctionHouse.controller')
const router = express.Router()

module.exports = () => {
  router.post('/create', controller.createAuctionHouse)
  router.get('/get/:id', controller.getAuctionHouse)
  router.get('/get', controller.getAuctionHouse)

  return router
}
