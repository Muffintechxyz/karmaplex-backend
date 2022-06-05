const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')
const AhNFTOffers = require('../ah_NFT_offers/ahNFToffers.model')

const AhNFTSale = sequelize.define('ah_nft_sale', {
  id: { type: DataTypes.STRING, primaryKey: true },
  mint: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  auction_house_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  seller_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  sale_price:{ type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  end_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  network: {type: DataTypes.STRING, allowNull: true, defaultValue: "mainnet"},
  active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  collection: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  tnx_sol_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  tnx_usd_amount:  { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  metadata: { type: DataTypes.JSON, allowNull: true},
  receipt: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  nft_name:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  url:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  sellerTradeState:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  paranoid: true,
  timestamps: true
})

AhNFTOffers.hasOne(AhNFTSale)
AhNFTSale.belongsTo(AhNFTOffers)

module.exports = AhNFTSale
