const moment = require('moment')
const { v4 } = require('uuid')
const Collection = require('./collection.model')
const uuidv4 = v4
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op;

const create  = async (req, res) => {

    try {
        
        const {
            title,
            description,
            collection,
            banner_url,
          } = req.body

          const collectionCreate = await Collection.create({
            id: uuidv4(),
            title,
            description,
            collection,
            banner_url
          });

          if (collectionCreate) {
            console.log(
              'collection record created',
              moment(new Date()).format('lll')
            )
            return res.status(201).json(collectionCreate)
          } else {
            throw new Error('Error with add new nftSale record')
          }
    } catch (error) {
        return res
        .status(400)
        .json({ message: error.message, dateTime: new Date() })
    }

}

module.exports = {
    create
}