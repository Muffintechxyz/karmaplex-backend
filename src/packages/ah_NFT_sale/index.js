const express = require('express')
const controller = require('./ahNFTSale.controller')
const router = express.Router()

module.exports = () => {
  router.post('/nft/listing', controller.listNFTforSale)
  router.get('/nft/collections', controller.getNFTGroupedByCollection)
  router.get('/nft/listing/:id', controller.getNFTforSale)
  router.get('/nft/listing', controller.getNFTforSale)
  router.get('/nft/collections/:id', controller.getNFTforSaleByCollection)
  router.patch('/nft/listing/:id', controller.addASaleEvent)
  router.delete('/nft/listing/:id', controller.cancelListing)
  router.get('/nft/statistics/:collection_name', controller.getStatistics);
  router.get('/nft/total-statistics', controller.getTotalStatistics);
  router.get('/nft/total-volumn/:collection_name', controller.getCollectionTotalVolumn);

  return router
}
