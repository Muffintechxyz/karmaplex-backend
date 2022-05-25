const moment = require('moment')
const { v4 } = require('uuid')
const AhNFTSale = require('./ahNFTSale.model')
const uuidv4 = v4


const listNFTforSale = async (req, res) => { 
    try {
        const {
            mint,
            auction_house_wallet,
            seller_wallet,
            sale_price,
            end_date,
            network,
            collection
          } = req.body
          const nftSale = await AhNFTSale.create({
            id: uuidv4(),
            mint,
            auction_house_wallet,
            seller_wallet,
            sale_price,
            end_date,
            network,
            collection
          })

          if (nftSale) {
            console.log(
              'nftSale record created',
              moment(new Date()).format('lll')
            )
            return res.status(201).json(nftSale)
          } else {
            throw new Error('Error with add new nftSale record')
          }
    } catch (error) {
        return res
        .status(500)
        .json({ message: error.message, dateTime: new Date() })
    }
}


const getNFTforSale = async (req, res) => {
    try {
        let NFTforSale;
        if (req.params.id) {
            NFTforSale = await AhNFTSale.findAll({
                where: { mint: req.params.id }
              })
        }
        else
        {
            NFTforSale = await AhNFTSale.findAll()
        }

        if (NFTforSale && NFTforSale.length > 0) {
          return res.status(201).json(NFTforSale)
        } else {
          throw new Error(`Details are not found for NFT mint key: ${req.params.id}`)
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: error.message, dateTime: new Date() })
      }
}

module.exports = {
    listNFTforSale,
    getNFTforSale,
  }