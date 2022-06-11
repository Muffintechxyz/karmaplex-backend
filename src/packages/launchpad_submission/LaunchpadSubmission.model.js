const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/DBConnection')

const LaunchpadSubmission = sequelize.define('launchpad_submissions', {
  id: { type: DataTypes.STRING, primaryKey: true },
  collection_name: { type: DataTypes.STRING, allowNull: false },
  collection_name_query_string: { type: DataTypes.STRING, allowNull: false },
  creator_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  creator_public_key: { type: DataTypes.STRING, allowNull: false },
  current_stage: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  is_legal: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  is_derivative: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  discord_id: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  email: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  project_description: { type: DataTypes.STRING(2000), allowNull: true, defaultValue: null },
  long_trm_goals: { type: DataTypes.STRING(2000), allowNull: true, defaultValue: null },
  team_description: { type: DataTypes.STRING(2000), allowNull: true, defaultValue: null },
  experience: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  twitter_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  discord_server: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  instagram_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  linked_in_profile: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  website_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  other_link: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  exp_mint_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  exp_item_count: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  is_team_dox: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  mint_price: { type: DataTypes.REAL, allowNull: true, defaultValue: 0 },
  marketing_package: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  other: { type: DataTypes.STRING(2000), allowNull: true, defaultValue: null },
  collection_image_url: { type: DataTypes.STRING, allowNull: false},
  collection_banner_url: { type: DataTypes.STRING, allowNull: false },
  approval_status: { type: DataTypes.ENUM('Pending', 'Approved'), defaultValue: 'Pending' },
  categories: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },
  featured: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  store_owner_wallet: { type: DataTypes.STRING, allowNull: false }
}, {
  paranoid: true,
  timestamps: true
})

module.exports = LaunchpadSubmission