const express = require('express')
const controller = require('./ahNFToffers.controller')
const router = express.Router()

module.exports = () => {
  router.post('/offers', controller.makeOffer)
  router.get('/offers/:id', controller.getOffers)
  router.get('/offers', controller.getOffers)
  router.delete('/offers/:id', controller.cancelOffer)
  return router
}
