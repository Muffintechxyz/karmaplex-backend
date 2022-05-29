const express = require('express')
const controller = require('./ahNFTSale.controller')
const router = express.Router()

module.exports = () => {
  router.post('/nft/listing', controller.listNFTforSale)
  router.get('/nft/listing/:id', controller.getNFTforSale)
  router.get('/nft/listing', controller.getNFTforSale)
  router.get('/nft/listing/collections/:id', controller.getNFTforSaleByCollection)
  router.patch('/nft/listing/:id', controller.addASaleEvent)

  return router
}
