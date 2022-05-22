const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const AuctionHouse = sequelize.define('auction_house', {
  id: { type: DataTypes.STRING, primaryKey: true },
  auction_house_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  fee_payer_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  treasury_wallet:{ type: DataTypes.STRING, allowNull: true, defaultValue: null },
  creator_wallet: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  requires_sign_off: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  mint: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  paranoid: true,
  timestamps: true
})

module.exports = AuctionHouse
