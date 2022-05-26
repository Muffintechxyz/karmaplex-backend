const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const AhNFTOffers = sequelize.define('ah_nft_offers', {
  id: { type: DataTypes.STRING, primaryKey: true },
  mint: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  auction_house_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  seller_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  buyer_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  offer_price:{ type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  offer_date: { type: DataTypes.DATE, allowNull: true, defaultValue: sequelize.NOW },
  network: {type: DataTypes.STRING, allowNull: true, defaultValue: "dev"},
  active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  collection: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  paranoid: true,
  timestamps: true
})

module.exports = AhNFTOffers
