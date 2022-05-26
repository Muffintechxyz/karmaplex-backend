const express = require('express')
const controller = require('./ahNFTOffers.controller')
const router = express.Router()

module.exports = () => {
  router.post('/offers', controller.makeOffer)
  router.get('/offers/:id', controller.getOffers)
  router.get('/offers', controller.getOffers)

  return router
}
