const moment = require('moment')
const { v4 } = require('uuid')
const AhNFTOffers = require('./ahNFToffers.model')

const uuidv4 = v4


const makeOffer = async (req, res) => { 
    try {
        const {
            mint,
            auction_house_wallet,
            seller_wallet,
            buyer_wallet,
            offer_price,
            network,
            active,
            collection,
            metadata,
            nft_name,
            url,
            receipt,
            buyerTradeState
          } = req.body
          const nftOffer = await AhNFTOffers.create({
            id: uuidv4(),
            mint,
            auction_house_wallet,
            seller_wallet,
            buyer_wallet,
            offer_price,
            network,
            active,
            collection,
            metadata,
            nft_name,
            url,
            receipt,
            buyerTradeState,
            active: true
          })

          if (nftOffer) {
            console.log(
              'nftOffer record created',
              moment(new Date()).format('lll')
            )
            return res.status(201).json(nftOffer)
          } else {
            return res
            .status(400)
            .json({ message: `Error with add new nftOffer record`, dateTime: new Date() })
          }
    } catch (error) {
        return res
        .status(500)
        .json({ message: error.message, dateTime: new Date() })
    }
}

const cancelOffer = async (req, res) => { 
  try {
        const offer = await AhNFTOffers.findOne({
          where: { id: req.params.id}
        })

        offer.set({
          active: false
        })

        await offer.save()

        if (offer) {
          console.log(
            'offer record cancelled',
            moment(new Date()).format('lll')
          )
          return res.status(201).json(offer)
        } else {
          return res
          .status(400)
          .json({ message: `Error with updating a offer record`, dateTime: new Date() })
        }
  } catch (error) {
      return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}


const getOffers = async (req, res) => {
    try {
        let NFTOffer;
        var seller = req.query?.seller;
        var buyer = req.query?.buyer;
        if (req.params.id) {
            NFTOffer = await AhNFTOffers.findAll({
                where: { 
                    mint: req.params.id,
                    active: true,
                    ...(!!seller && {seller_wallet: seller}),
                    ...(!!buyer && {buyer_wallet: buyer})
                }
              })
        }
        else
        {
            NFTOffer = await AhNFTOffers.findAll({
                where: { 
                    active: true,
                    ...(!!seller && {seller_wallet: seller}),
                    ...(!!buyer && {buyer_wallet: buyer})
                }
              })
        }

        if (!!NFTOffer) {
          return res.status(201).json(NFTOffer)
        } else {
          return res
          .status(400)
          .json({ message: `Offers are not found for filter criteria`, dateTime: new Date() })
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: error.message, dateTime: new Date() })
      }
}

module.exports = {
    makeOffer,
    getOffers,
    cancelOffer
  }