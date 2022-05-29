const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const AhNFTSale = sequelize.define('ah_nft_sale', {
  id: { type: DataTypes.STRING, primaryKey: true },
  mint: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  auction_house_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  seller_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  sale_price:{ type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  end_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  network: {type: DataTypes.STRING, allowNull: true, defaultValue: "dev"},
  active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  collection: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  tnx_sol_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  tnx_usd_amount:  { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  offer_id: { type: DataTypes.STRING, allowNull: true },
  metadata: { type: DataTypes.JSON, allowNull: true},
  nft_name:  { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  url:  { type: DataTypes.STRING, allowNull: true, defaultValue: null }
}, {
  paranoid: true,
  timestamps: true
})

module.exports = AhNFTSale
