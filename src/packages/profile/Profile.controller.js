const Profile = require('./Profile.model')
const aws = require('aws-sdk')
const { v4 } = require('uuid')
const Config = require('../../configs')
const uuidv4 = v4

const s3 = new aws.S3({
  accessKeyId: Config.S3_ACCESS_KEY,
  secretAccessKey: Config.S3_SECRET_ACCESS_KEY,
  region: Config.S3_REGION
})

const addProfileInfo = async (req, res) => {
  try {
    const profileInfo = req.body

    if (!profileInfo.public_key) {
      throw new Error('Public key not found')
    }

    let profile = await Profile.findOne({
      where: { public_key: profileInfo.public_key }
    })

    let image_url = null;
    const collectionProfile = 'collection_profile'
    if (!!req.files?.image) {
      image_url = await new Promise((resolve, reject) => {
        let key = new Date().getTime() + "_" + Math.floor(Math.random() * 1000000 + 1) + ".jpeg";
        s3.putObject({
          Bucket: Config.S3_BUCKET_NAME + '/' + collectionProfile,
          ContentType: "image/jpeg",
          Key: key,
          Body: req.files.image[0].buffer
        }, (err, _data) => {
          if (err) {
            return reject(err.message)
          }
          const imageURL = Config.S3_BUCKET_URL + '/' + collectionProfile + '/' + key
          return resolve(imageURL)
        })
      })
    } else {
      image_url = profile && profile.image ? profile.image : null
    }

    let modfiedProfileInfo = {
      ...(profileInfo.user_name && {user_name: profileInfo.user_name}),
      ...(profileInfo.public_key && {public_key: profileInfo.public_key}),
      ...(profileInfo.email && {email: profileInfo.email}),
      ...(profileInfo.twitter_link && {twitter_link: profileInfo.twitter_link}),
      ...(profileInfo.discord_link && {discord_link: profileInfo.discord_link}),
      ...(profileInfo.telegram && {telegram: profileInfo.telegram}),
      ...(profileInfo.discord_link && {discord_link: profileInfo.discord_link}),
      ...(profileInfo.bio && {bio: profileInfo.bio}),
      ...(image_url && {image: image_url}),
      ...(profileInfo.whitelist_name && {whitelist_name: profileInfo.whitelist_name})
    }
    
    if (profile) {
      profile = await Profile.update(modfiedProfileInfo, {
        where: { public_key: profileInfo.public_key }
      })
    } else {
      modfiedProfileInfo.id = uuidv4()
      profile = await Profile.create(modfiedProfileInfo)
    }

    res.status(200).json({ data: profile, datetime: new Date(), isSuccess: true })
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date(), isSuccess: false })
  }
}

const getProfile = async (req, res) => {
  try {
    const publicKey = req.params.id

    let profile;
    if (publicKey) {
      profile = await Profile.findOne({
        where: { public_key: publicKey },
        attributes: ['id', 'user_name', 'email', 'public_key', 'twitter_link', 'discord_link', 'telegram', 'bio', 'image', 'whitelist_name']
      })
    } else {
      profile = await Profile.findAll({
        attributes: ['id', 'user_name', 'email', 'public_key', 'twitter_link', 'discord_link', 'telegram', 'bio', 'image', 'whitelist_name']
      })
    }

    if (!profile) {
      return res.status(200).json({ data: profile, datetime: new Date(), isSuccess: true })
    }

    return res.status(200).json({ data: profile, datetime: new Date(), isSuccess: true })
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date(), isSuccess: false })
  }
}

module.exports = {
  addProfileInfo,
  getProfile
}