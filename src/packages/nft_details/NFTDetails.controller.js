const NFTDetails = require('./NFTDetails.model')
const moment = require('moment')
const { v4 } = require('uuid')
const uuidv4 = v4
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op;

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

const getStatistics = async (req, res) => {
  try {

    let startDate = moment().startOf('week').add(1, "day").format("YYYY-MM-DD");
    let endDate = moment().endOf('week').add(1, "day").format("YYYY-MM-DD");

    console.log("--start--", startDate);
    console.log("--end--", endDate);

    let nftStatistics = await NFTDetails.findAll({
      attributes: ['datetime',[Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_cost']],
      where: { 
        collectionName: req.params.collection_name,
        datetime: {
          [Op.between]: [startDate, endDate],
        },
        tnx_type: 'Sale' 
      },
      group: ['datetime']
    })

    let nftTotalSales = await NFTDetails.findOne({
      attributes: [[Sequelize.fn('sum', Sequelize.col('tnx_sol_amount')), 'total_sol'], [Sequelize.fn('sum', Sequelize.col('tnx_usd_amount')), 'total_usd']],
      where: { 
        collectionName: req.params.collection_name,
        datetime: {
          [Op.between]: [startDate, endDate],
        },
        tnx_type: 'Sale' 
      }
    })

    let nftActivities = await NFTDetails.findAll({
      attributes:[['mint', 'description'],['tnx_usd_amount', 'price'], ['from_address','fromAddress'], ['to_address','toAddress'], ['datetime','time']],
      where: { 
        collectionName: req.params.collection_name,
        datetime: {
          [Op.between]: [startDate, endDate],
        },
        tnx_type: 'Sale' 
      }
    })

    nftStatistics = JSON.parse(JSON.stringify(nftStatistics))

    console.log(nftStatistics)

    if (nftStatistics && nftStatistics.length > 0) {

      let days7 = [];
      let nextInLine = "Monday";
      for(let i = 0; i < 7; i++){

          let currentSales = nftStatistics[i] || {datetime: null};
          if(nextInLine === moment(currentSales["datetime"]).format("dddd")){
            days7.push({
              label: moment(currentSales["datetime"]).format("dddd"),
              price: currentSales.total_cost
            })

            nextInLine = moment(currentSales["datetime"]).add(1, "day").format("dddd")
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

      return res.status(200).json({
        days7,
        nftTotalSales,
        nftActivities
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
  createNFTDetails,
  getNFTDetails,
  getStatistics
}
