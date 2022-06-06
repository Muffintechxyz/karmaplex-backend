const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const Collection = sequelize.define('collection', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  description: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  collection: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  banner_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  paranoid: true,
  timestamps: true
})

module.exports = Collection
