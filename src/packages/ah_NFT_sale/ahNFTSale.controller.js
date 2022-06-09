const moment = require('moment')
const _ = require('lodash')
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
      price_floor,
      price_floor_usd,
      receipt,
      sellerTradeState,
      extendedData
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
      price_floor,
      price_floor_usd,
      receipt,
      sellerTradeState,
      extendedData,
      active: true,
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
      ahNftOfferId,
      active,
    } = req.body

    const nft = await AhNFTSale.findOne({
      where: { id: req.params.id }
    })

    nft.set({
      tnx_sol_amount,
      tnx_usd_amount,
      ahNftOfferId,
      active: false,
    })

    await nft.save()

    const offers = await AhNFTOffers.findAll({
      where: { mint: nft.mint }
    })

    if (Array.isArray(offers)) {
      offers.forEach((offer) => {
        offer.set({
          active: false
        })
      })
    } else {
      offers.set({
        active: false
      })
    }

    await offers.save()

    if (nft) {
      console.log(
        'nftSale record created',
        moment(new Date()).format('lll')
      )
      return res.status(201).json(nft)
    } else {
      return res
        .status(400)
        .json({ message: 'Error with updating a nftSale record', dateTime: new Date() })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const cancelListing = async (req, res) => {
  try {
    const sale = await AhNFTSale.findOne({
      where: { id: req.params.id }
    })

    sale.set({
      active: false
    })

    await sale.save()

    if (sale) {
      console.log(
        'sale record cancelled',
        moment(new Date()).format('lll')
      )
      return res.status(201).json(sale)
    } else {
      return res
        .status(400)
        .json({ message: 'Error with updating a sale record', dateTime: new Date() })
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
    else {
      NFTforSale = await AhNFTSale.findAll({
        include: AhNFTOffers,
        where: { active: true },
      })
    }

    if (!!NFTforSale) {
      return res.status(201).json(NFTforSale)
    } else {
      return res
        .status(400)
        .json({ message: `Details are not found for NFT mint key: ${req.params.id}`, dateTime: new Date() })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const getAllSoldActivities = async (req, res) => {
  try {
    let NFTforSale;
    if (req.params.id) {
      NFTforSale = await AhNFTSale.findAll({
        where: {
          mint: req.params.id, [Op.or]: [
            {
              active:
              {
                [Op.eq]: true
              }
            },
            {
              ahNftOfferId:
              {
                [Op.not]: null
              }
            }
          ]
        },
        order: [['updatedAt', 'DESC']],
        include: AhNFTOffers
      })
    }
    else {
      NFTforSale = await AhNFTSale.findAll({
        include: AhNFTOffers,
        where: { ahNftOfferId: { [Op.not]: null } },
      })
    }

    if (!!NFTforSale) {
      return res.status(201).json(NFTforSale)
    } else {
      return res
        .status(400)
        .json({ message: `Details are not found for NFT mint key: ${req.params.id}`, dateTime: new Date() })
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
        where: { collection: req.params.id, active: true },
        include: AhNFTOffers
      })
    }
    else {
      NFTforSale = await AhNFTSale.findAll(
        {
          where: {
            ...(!!seller && { seller_wallet: seller }),
            include: AhNFTOffers
          }
        })
    }

    if (NFTforSale && NFTforSale.length > 0) {
      return res.status(201).json(NFTforSale)
    } else {
      return res
        .status(400)
        .json({ message: `Details are not found for NFT mint key: ${req.params.id}`, dateTime: new Date() })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, dateTime: new Date() })
  }
}


const getNFTGroupedByCollection = async (req, res) => {
  try {
    let NFTsforSale;
    NFTsforSale = await AhNFTSale.findAll(
      {
        include: AhNFTOffers,
        where: { active: true }
      })
    const groupedNFTs = _.groupBy(NFTsforSale, NFTsforSale => NFTsforSale.collection)

    return res.status(201).json(Object.keys(groupedNFTs).map(key => ({ collection: key, nfts: groupedNFTs[key] })))

  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const getStatistics = async (req, res) => {
  try {

    let startDate = moment().startOf('week').add(1, "day").format("YYYY-MM-DD");
    let endDate = moment().endOf('week').add(1, "day").format("YYYY-MM-DD");

    let nftStatistics = await AhNFTSale.findAll({
      attributes: ['end_date', [Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_cost']],
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
        collection: req.params.collection_name
      }
    })

    let nftActivities = await AhNFTSale.findAll({
      attributes: [['mint', 'description'], ['tnx_usd_amount', 'price'], ['auction_house_wallet', 'fromAddress'], ['seller_wallet', 'toAddress'], ['end_date', 'time'], ['url', 'image']],
      where: {
        collection: req.params.collection_name
      }
    })

    nftStatistics = JSON.parse(JSON.stringify(nftStatistics))
    nftTotalSales = JSON.parse(JSON.stringify(nftTotalSales))

    let days7 = [];
    let nextInLine = "Monday";
    for (let i = 0; i < 7; i++) {

      let currentSales = nftStatistics[i] || { end_date: null, total_cost: 0 };
      if (nextInLine === moment(currentSales["end_date"]).format("dddd")) {
        days7.push({
          label: moment(currentSales["end_date"]).format("dddd"),
          price: currentSales.total_cost
        })

        nextInLine = moment(currentSales["end_date"]).add(1, "day").format("dddd")
      } else if (nextInLine === "Monday") {
        days7.push({
          label: "Monday",
          price: 0
        })

        nextInLine = "Tuesday"
      } else if (nextInLine === "Tuesday") {
        days7.push({
          label: "Tuesday",
          price: 0
        })

        nextInLine = "Wednesday"
      } else if (nextInLine === "Wednesday") {
        days7.push({
          label: "Wednesday",
          price: 0
        })

        nextInLine = "Thursday"
      } else if (nextInLine === "Thursday") {
        days7.push({
          label: "Thursday",
          price: 0
        })

        nextInLine = "Friday"
      } else if (nextInLine === "Friday") {
        days7.push({
          label: "Friday",
          price: 0
        })

        nextInLine = "Saturday"
      } else if (nextInLine === "Saturday") {
        days7.push({
          label: "Saturday",
          price: 0
        })

        nextInLine = "Sunday"
      } else if (nextInLine === "Sunday") {
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
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const getTotalStatistics = async (req, res) => {
  try {

    let nftStatistics = await AhNFTSale.findAll({
      attributes: [
        'collection',
        [Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'tnx_sol_amount'],
        [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'tnx_usd_amount'],
        [Sequelize.fn('min', Sequelize.col('price_floor')), 'floorSolAmount'],
        [Sequelize.fn('min', Sequelize.col('price_floor_usd')), 'floorDollarAmount'],
        [Sequelize.fn('count', Sequelize.col('mint')), 'itemCount'],
      ],
      group: ['collection']
    })

    //serialize sequelize object
    nftStatistics = JSON.parse(JSON.stringify(nftStatistics));

    let nftStates = [];

    //weekly stats dates
    let startDate = moment().subtract(6, "day").format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");

    let i = 0;
    for (const ntfStat of nftStatistics) {

      //weekly stats data
      let nftStatistics7days = await AhNFTSale.findOne({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'tnx_sol_amount'],
          [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'tnx_usd_amount'],
        ],
        where: {
          collection: ntfStat.collection,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('end_date')), '>=', startDate),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('end_date')), '<=', endDate),
          ]
        }
      })

      nftStatistics7days = JSON.parse(JSON.stringify(nftStatistics7days));

      let nft7DayValue = 0;

      if (nftStatistics7days) {
        nft7DayValue = nftStatistics7days.tnx_sol_amount
      }

      //24hour stats data
      let nftStatistics24Hours = await AhNFTSale.findOne({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'tnx_sol_amount'],
          [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'tnx_usd_amount'],
          [Sequelize.fn('count', Sequelize.col('mint')), 'itemCount']
        ],
        where: {
          collection: ntfStat.collection,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('end_date')), '=', endDate),
          ]
        }
      })

      nftStatistics24Hours = JSON.parse(JSON.stringify(nftStatistics24Hours));

      let nft24HourValue = 0;
      let nft24HourDollarValue = 0
      let itemCount24Hours = 0;

      if (nftStatistics24Hours) {

        itemCount24Hours = nftStatistics24Hours.itemCount !== null ? nftStatistics24Hours.itemCount : 0;

        nft24HourValue = nftStatistics24Hours.tnx_sol_amount !== null ? itemCount24Hours > 0 ? (nftStatistics24Hours.tnx_sol_amount / itemCount24Hours).toFixed(5) : 0 : 0;
        nft24HourDollarValue = nftStatistics24Hours.tnx_usd_amount !== null ? itemCount24Hours > 0 ? (nftStatistics24Hours.tnx_usd_amount / itemCount24Hours).toFixed(5) : 0 : 0;
      }

      let temp = {
        id: i,
        rank: "#" + (i + 1),
        NFTName: ntfStat.collection,
        itemCount: ntfStat.itemCount,
        image: null,
        marketCap: {
          amount: ntfStat.tnx_sol_amount,
          dollarValue: "$" + ntfStat.tnx_usd_amount
        },
        volume: {
          volumeAmount: nft7DayValue,
          volumePercentage: '',
          isPositive: true
        },
        avgPrice: {
          avgSolAmount: nft24HourValue,
          history: nft24HourDollarValue
        },
        floorPrice: {
          floorSolAmount: ntfStat.floorSolAmount !== null ? ntfStat.floorSolAmount : 0,
          floorDollarAmount: ntfStat.floorDollarAmount !== null ? ntfStat.floorDollarAmount : 0
        }
      };

      i++;

      nftStates.push(temp);



    }

    //Statbar calculations
    let statBar = await AhNFTSale.findOne({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'volumn'],
        [Sequelize.fn('count', Sequelize.col('collection')), 'collection']
      ],
      raw: true,
    });

    //get owner count
    let owners = await AhNFTSale.count({
      col: 'seller_wallet',
      distinct: true,
    });

    //serialize sequelize object
    owners = JSON.parse(JSON.stringify(owners));

    //serialize sequelize object
    statBar = JSON.parse(JSON.stringify(statBar));

    statBar["categories"] = 4;
    statBar["owners"] = owners;

    return res.status(200).json({
      nftStates,
      statBar
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message, dateTime: new Date() })
  }
}

const getCollectionTotalVolumn = async (req, res) => {
  try {

    let nftTotalSales = await AhNFTSale.findOne({
      attributes: [[Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_sol'], [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'total_usd']],
      where: {
        collection: req.params.collection_name
      }
    })

    return res.status(200).json({
      nftTotalSales
    })

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
  getStatistics,
  getTotalStatistics,
  getCollectionTotalVolumn,
  cancelListing,
  getCollectionTotalVolumn,
  getNFTGroupedByCollection,
  getAllSoldActivities
}