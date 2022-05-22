const AuctionHouse = require('./AuctionHouse.model')
const moment = require('moment')
const { v4 } = require('uuid')
const uuidv4 = v4


const createAuctionHouse = async (req, res) => { 
    try {
        const {
            auction_house_wallet,
            fee_payer_wallet,
            treasury_wallet,
            creator_wallet,
            requires_sign_off,
            mint,
          } = req.body
          const auctionHouse = await AuctionHouse.create({
            id: uuidv4(),
            auction_house_wallet,
            fee_payer_wallet,
            treasury_wallet,
            creator_wallet,
            requires_sign_off,
            mint,
          })

          if (auctionHouse) {
            console.log(
              'auctionHouse record created',
              moment(new Date()).format('lll')
            )
            return res.status(201).json(auctionHouse)
          } else {
            throw new Error('Error with add new auctionHouse record')
          }
    } catch (error) {
        return res
        .status(500)
        .json({ message: error.message, dateTime: new Date() })
    }
}


const getAuctionHouse = async (req, res) => {
    try {
        let auctioHouse;
        if (req.params.id) {
            auctioHouse = await AuctionHouse.findAll({
                where: { mint: req.params.id }
              })
        }
        else
        {
            auctioHouse = await AuctionHouse.findAll()
        }

        if (auctioHouse && auctioHouse.length > 0) {
          return res.status(201).json(auctioHouse)
        } else {
          throw new Error(`Details are not found for auctioHouse key: ${req.params.id}`)
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: error.message, dateTime: new Date() })
      }
}

module.exports = {
    createAuctionHouse,
    getAuctionHouse,
  }