require('dotenv').config()
const express = require('express')
const cors = require('cors')
const moment = require('moment')
const database = require('./utils/DBConnection')
const nftDetails = require('./packages/nft_details')
const launchpadSubmission = require('./packages/launchpad_submission')

const main = () => {
  const app = express()
  const port = process.env.PORT || '9000'

  app.use(cors())
  app.use(express.json({ limit: '5mb' }))
  app.use((req, _res, next) => {
    req.db = database
    next()
  })
  app.use(nftDetails())
  app.use(launchpadSubmission())

  app.get('/', (req, res) => {
    res.send(`
      <div style="display: flex; justify-content: center;">
        <h2 style="margin: 0px;">Karmaplex Backend API v1.0.3</h2>
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

