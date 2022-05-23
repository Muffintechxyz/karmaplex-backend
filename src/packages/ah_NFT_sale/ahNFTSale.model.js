const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const AhNFTSale = sequelize.define('ah_nft_sale', {
  id: { type: DataTypes.STRING, primaryKey: true },
  mint: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  auction_house_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  seller_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  sale_price:{ type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
  end_date: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  network: {type: DataTypes.STRING, allowNull: true, defaultValue: "dev"}
}, {
  paranoid: true,
  timestamps: true
})

module.exports = AhNFTSale
