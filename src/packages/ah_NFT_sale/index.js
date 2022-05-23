const express = require('express')
const controller = require('./ahNFTSale.controller')
const router = express.Router()

module.exports = () => {
  router.post('/nft/list', controller.listNFTforSale)
  router.get('/net/get/:id', controller.getNFTforSale)
  router.get('/net/get', controller.getNFTforSale)

  return router
}
