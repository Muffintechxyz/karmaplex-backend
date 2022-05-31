const NFTDetails = require('./NFTDetails.model')
const moment = require('moment')
const { v4 } = require('uuid')
const uuidv4 = v4

const createNFTDetails = async (req, res) => {
  try {
    const {
      tnx_hash,
      tnx_type,
      datetime,
      tnx_sol_amount,
      tnx_usd_amount,
      from_address,
      to_address,
      collection,
      mint,
      auction,
    } = req.body

    const nftDetails = await NFTDetails.create({
      id: uuidv4(),
      tnx_hash: tnx_hash,
      tnx_type: tnx_type,
      datetime: datetime,
      tnx_sol_amount: tnx_sol_amount,
      tnx_usd_amount: tnx_usd_amount,
      from_address: from_address,
      to_address: to_address,
      collectionName: collection,
      mint: mint,
      auction: auction,
    })

    if (nftDetails) {
      console.log(
        'NFT details record created',
        moment(new Date()).format('lll')
      )
      return res.status(201).json(nftDetails)
    } else {
      throw new Error('Error with add new nft details record')
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const getNFTDetails = async (req, res) => {
  try {
    const nftDetails = await NFTDetails.findAll({
      where: { mint: req.params.id }
    })

    if (nftDetails && nftDetails.length > 0) {
      return res.status(201).json(nftDetails)
    } else {
      throw new Error(`Details are not found for mint key: ${req.params.id}`)
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}

module.exports = {
  createNFTDetails,
  getNFTDetails,
}
