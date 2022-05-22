require('dotenv').config()
const express = require('express')
const cors = require('cors')
const moment = require('moment')
const database = require('./utils/DBConnection')
const { launchpad_submission, nft_details, profile, auctionHouse } = require('./packages')


const main = () => {
  const app = express()
  const port = process.env.PORT || '9000'

  app.use(cors())
  app.use(express.json({ limit: '5mb' }))
  app.use((req, _res, next) => {
    req.db = database
    next()
  })
  app.use(nft_details())
  app.use(launchpad_submission())
  app.use(profile())
  app.use(auctionHouse())

  app.get('/', (req, res) => {
    res.send(`
      <div style="display: flex; justify-content: center;">
        <h2 style="margin: 0px;">Karmaplex Backend API v1.0.5</h2>
      </div>
      <div style="display: flex; justify-content: center;">
        <h3 style="margin: 0px;">${moment(new Date()).format('LLLL')}<//h3>
      </div>
    `)
  })

  app.listen(port, () => {
    console.log(`Test API is up & running on port ${port}, ${moment(new Date()).format('lll')}`)
  })
}

main()

