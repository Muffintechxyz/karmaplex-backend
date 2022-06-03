const moment = require('moment')
const { v4 } = require('uuid')
const AhNFTSale = require('./ahNFTSale.model')
const uuidv4 = v4
const { Sequelize } = require('sequelize')
const AhNFTOffers = require('../ah_NFT_offers/ahNFToffers.model')
const Op = Sequelize.Op;


const listNFTforSale = async (req, res) => { 
    try {
        const {
            mint,
            auction_house_wallet,
            seller_wallet,
            sale_price,
            end_date,
            network,
            collection,
            metadata, 
            nft_name,
            url,
            receipt,
            sellerTradeState
          } = req.body
          const nftSale = await AhNFTSale.create({
            id: uuidv4(),
            mint,
            auction_house_wallet,
            seller_wallet,
            sale_price,
            end_date,
            network,
            collection,
            metadata, 
            nft_name,
            url,
            receipt,
            sellerTradeState,
            active: true
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


const addASaleEvent = async (req, res) => { 
  try {
      const {
        tnx_sol_amount,
        tnx_usd_amount,
        ahNftOfferId
        } = req.body

        const nft = await AhNFTSale.findOne({
          where: { id: req.params.id}
        })

        nft.set({
          tnx_sol_amount,
          tnx_usd_amount,
          ahNftOfferId
        })

        await nft.save()

        if (nft) {
          console.log(
            'nftSale record created',
            moment(new Date()).format('lll')
          )
          return res.status(201).json(nft)
        } else {
          throw new Error('Error with updating a nftSale record')
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
            NFTforSale = await AhNFTSale.findOne({
                where: { mint: req.params.id, active: true },
                include: AhNFTOffers
              })
        }
        else
        {
            NFTforSale = await AhNFTSale.findAll({
              include: AhNFTOffers,
              where: { active: true },
            })
        }

        if (!!NFTforSale) {
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

const getNFTforSaleByCollection = async (req, res) => {
  try {
      let NFTforSale;
      var seller = req.query?.seller;
      if (req.params.id) {
          NFTforSale = await AhNFTSale.findAll({
              where: { collection: req.params.id },
              include: AhNFTOffers
            })
      }
      else
      {
          NFTforSale = await AhNFTSale.findAll(
            {                
              where: { ...(!!seller && {seller_wallet: seller}),
              include: AhNFTOffers
          }
        })
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

const getStatistics = async (req, res) => {
  try {

    let startDate = moment().startOf('week').add(1, "day").format("YYYY-MM-DD");
    let endDate = moment().endOf('week').add(1, "day").format("YYYY-MM-DD");

    let nftStatistics = await AhNFTSale.findAll({
      attributes: ['end_date',[Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_cost']],
      where: { 
        collection: req.params.collection_name,
        end_date: {
          [Op.between]: [startDate, endDate],
        }
      },
      group: ['end_date']
    })

    let nftTotalSales = await AhNFTSale.findOne({
      attributes: [[Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_sol'], [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'total_usd']],
      where: { 
        collection: req.params.collection_name,
        end_date: {
          [Op.between]: [startDate, endDate],
        }
      }
    })

    let nftActivities = await AhNFTSale.findAll({
      attributes:[['mint', 'description'],['tnx_usd_amount', 'price'], ['auction_house_wallet','fromAddress'], ['seller_wallet','toAddress'], ['end_date','time'], ['url', 'image']],
      where: { 
        collection: req.params.collection_name,
        end_date: {
          [Op.between]: [startDate, endDate],
        }
      }
    })

    nftStatistics = JSON.parse(JSON.stringify(nftStatistics))
    nftTotalSales = JSON.parse(JSON.stringify(nftTotalSales))

    if (nftStatistics) {

      let days7 = [];
      let nextInLine = "Monday";
      for(let i = 0; i < 7; i++){

          let currentSales = nftStatistics[i] || {end_date: null};
          if(nextInLine === moment(currentSales["end_date"]).format("dddd")){
            days7.push({
              label: moment(currentSales["end_date"]).format("dddd"),
              price: currentSales.total_cost
            })

            nextInLine = moment(currentSales["end_date"]).add(1, "day").format("dddd")
          }else if(nextInLine === "Monday") {
            days7.push({
              label: "Monday",
              price: 0
            })

            nextInLine = "Tuesday"
          }else if(nextInLine === "Tuesday") {
            days7.push({
              label: "Tuesday",
              price: 0
            })

            nextInLine = "Wednesday"
          }else if(nextInLine === "Wednesday") {
            days7.push({
              label: "Wednesday",
              price: 0
            })

            nextInLine = "Thursday"
          }else if(nextInLine === "Thursday") {
            days7.push({
              label: "Thursday",
              price: 0
            })

            nextInLine = "Friday"
          }else if(nextInLine === "Friday") {
            days7.push({
              label: "Friday",
              price: 0
            })

            nextInLine = "Saturday"
          }else if(nextInLine === "Saturday") {
            days7.push({
              label: "Saturday",
              price: 0
            })

            nextInLine = "Sunday"
          }else if(nextInLine === "Sunday") {
            days7.push({
              label: "Sunday",
              price: 0
            })

            nextInLine = "Monday"
          }

      }

      let nftSales = {
        total_sol: nftTotalSales !== null ? nftTotalSales.total_sol != null ? nftTotalSales.total_sol : 0 : 0,
        total_usd: nftTotalSales ? nftTotalSales.total_usd != null ? nftTotalSales.total_usd : 0 : 0
      }

      return res.status(200).json({
        days7,
        nftTotalSales: nftSales,
        nftActivities: nftActivities !== null ? nftActivities : [],
      })
    } else {
      throw new Error(`Details are not found for collection: ${req.params.collection_name}`)
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, dateTime: new Date() })
  }
}



module.exports = {
    listNFTforSale,
    getNFTforSale,
    getNFTforSaleByCollection,
    addASaleEvent,
    getStatistics
  }