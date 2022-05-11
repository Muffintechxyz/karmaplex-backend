const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const Profile = sequelize.define('profiles', {
  id: { type: DataTypes.STRING, primaryKey: true },
  user_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  email: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  public_key: { type: DataTypes.STRING, allowNull: false },
  twitter_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  discord_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  telegram: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  bio: { type: DataTypes.STRING(5000), allowNull: true, defaultValue: null },
  image: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
}, {
  paranoid: true,
  timestamps: true
})

module.exports = Profile