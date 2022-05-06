const LaunchpadSubmission = require('./LaunchpadSubmission.model')
const aws = require('aws-sdk')
const Config = require('../../configs')
const { v4 } = require('uuid')
const uuidv4 = v4

const s3 = new aws.S3({
  accessKeyId: Config.S3_ACCESS_KEY,
  secretAccessKey: Config.S3_SECRET_ACCESS_KEY,
  region: Config.S3_REGION
})

const addSubmission = async (req, res) => {
  try {
    const userData = JSON.parse(req.body.userDetails)
    const duplicateDocs = await findDuplicate(userData.collection_name)

    if (!duplicateDocs.isSuccess) {
      throw new Error(duplicateDocs.message)
    }

    let collectionImageURL;
    let collectionBannerURL;
    const collectionImage = 'collection_images'
    const collectionBanner = 'collection_banners'

    // Upload collection image
    if (req.files.collection_image) {
      collectionImageURL = await new Promise((resolve, reject) => {
        let key = new Date().getTime() + "_" + Math.floor(Math.random() * 1000000 + 1) + ".jpeg";
        s3.putObject({
          Bucket: Config.S3_BUCKET_NAME + '/' + collectionImage,
          ContentType: "image/jpeg",
          Key: key,
          Body: req.files.collection_image[0].buffer
        }, (err, _data) => {
          if (err) {
            return reject(err.message)
          }
          const imageURL = Config.S3_BUCKET_URL + '/' + collectionImage + '/' + key
          return resolve(imageURL)
        })
      })
    }

    // Upload collection banner image
    if (req.files.collection_banner) {
      collectionBannerURL = await new Promise((resolve, reject) => {
        let key = new Date().getTime() + "_" + Math.floor(Math.random() * 1000000 + 1) + ".jpeg";
        s3.putObject({
          Bucket: Config.S3_BUCKET_NAME + '/' + collectionBanner,
          ContentType: "image/jpeg",
          Key: key,
          Body: req.files.collection_banner[0].buffer
        }, (err, _data) => {
          if (err) {
            return reject(err.message)
          }
          const imageURL = Config.S3_BUCKET_URL + '/' + collectionBanner + '/' + key
          return resolve(imageURL)
        })
      })
    }

    let modifiedCollectionName;

    if (userData.collection_name && /\s/g.test(userData.collection_name)) {
      modifiedCollectionName = userData.collection_name.replace(/\s/g, '%')
    } else {
      modifiedCollectionName = userData.collection_name
    }

    const submissionDoc = {
      id: uuidv4(),
      collection_name: userData.collection_name,
      collection_name_query_string: modifiedCollectionName,
      creator_name: userData.creator_name,
      creator_public_key: userData.creator_public_key,
      current_stage: userData.current_stage,
      is_legal: userData.is_legal,
      is_derivative: userData.is_derivative,
      discord_id: userData.discord_id,
      email: userData.email,
      project_description: userData.project_description,
      long_trm_goals: userData.long_trm_goals,
      team_description: userData.team_description,
      experience: userData.experience,
      twitter_link: userData.twitter_link,
      discord_server: userData.discord_server,
      instagram_link: userData.instagram_link,
      linked_in_profile: userData.linked_in_profile,
      website_link: userData.website_link,
      other_link: userData.other_link,
      exp_mint_date: userData.exp_mint_date,
      exp_item_count: userData.exp_item_count,
      is_team_dox: userData.is_team_dox,
      mint_price: userData.mint_price,
      marketing_package: userData.marketing_package,
      other: userData.other,
      categories: userData.categories,
      collection_image_url: collectionImageURL,
      collection_banner_url: collectionBannerURL,
      featured: false,
    }

    const submission = await LaunchpadSubmission.create(submissionDoc)

    res.status(200).json({ data: submission, datetime: new Date(), isSuccess: true })
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date(), isSuccess: false })
  }
}

const getSubmissions = async (req, res) => {
  try {
    const submissions = await LaunchpadSubmission.findAll()

    if (submissions.length > 0) {
      let formattedSubmissions = []
      for (let submission of submissions) {
        let item = {
          id: submission.id,
          creator_public_key: submission.creator_public_key,
          collection_name: submission.collection_name,
          collection_image_url: submission.collection_image_url,
          collection_banner_url: submission.collection_banner_url,
          approval_status: submission.approval_status,
          exp_mint_date: submission.exp_mint_date,
          featured: submission.featured,
          mint_price: submission.mint_price,
          actions: {
            address: submission.creator_public_key,
            status: submission.approval_status
          }
        }

        formattedSubmissions.push(item)
      }
      res.status(200).json({ data: formattedSubmissions, datetime: new Date() })
    } else {
      res.status(200).json({ data: [], datetime: new Date() })
    }
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const statusToApprove = async (req, res) => {
  try {
    const docId = req.body.creatorPublicKey

    if (!docId) {
      throw new Error('Document ID not found')
    }

    const submissionDoc = await LaunchpadSubmission.findOne({
      where: { creator_public_key: docId }
    })

    if (submissionDoc) {
      await LaunchpadSubmission.update(
        { approval_status: 'Approved' }, 
        { where: { creator_public_key: docId } }
      )
      res.status(200).json({ data: submissionDoc, datetime: new Date() })
    } else {
      throw new Error('Submission details are not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const findByCollectionName = async (req, res) => {
  try {
    const collectionName = req.params.id 
    let modifiedName = collectionName
    const isSpace = /\s/g.test(collectionName)

    if (isSpace) {
      modifiedName = collectionName.replace(/\s/g, '%')
    }

    const collectionDoc = await LaunchpadSubmission.findOne({
      where: { collection_name_query_string: modifiedName }
    })

    if (collectionDoc) {
      const responseData = {
        collection_name: collectionDoc.collection_name,
        creator_public_key: collectionDoc.creator_public_key,
        project_description: collectionDoc.project_description,
        collection_image_url: collectionDoc.collection_image_url,
        collection_banner_url: collectionDoc.collection_banner_url,
      }
      res.status(200).json(responseData)
    } else {
      throw new Error('Collection details are not found')
    }
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const findByMint = async (req, res) => {
  try {
    const publicKey = req.params.id 
    const collectionName = req.params.collectionName
    const collectionDoc = await LaunchpadSubmission.findOne({
      where: { creator_public_key: publicKey, collection_name: collectionName }
    })

    if (collectionDoc) {
      const responseData = {
        collection_name: collectionDoc.collection_name,
        creator_public_key: collectionDoc.creator_public_key,
        project_description: collectionDoc.project_description,
        collection_image_url: collectionDoc.collection_image_url,
        collection_banner_url: collectionDoc.collection_banner_url,
      }
      res.status(200).json(responseData)
    } else {
      throw new Error('Collection details are not found')
    } 
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const makrAsFeatured = async (req, res) => {
  try {
    const submissionId = req.params.id
    const submission = await LaunchpadSubmission.findOne({
      where: { id: submissionId }
    })

    if (submission) {
      // Find current featured one
      const currentFeaturedSubmission = await LaunchpadSubmission.findOne({
        where: { featured: true }
      })

      // If current activated one not equal to passed id -> Mark the current as false
      if (currentFeaturedSubmission && currentFeaturedSubmission.id !== submissionId) {
        await LaunchpadSubmission.update(
          { featured: false },
          { where: { id: currentFeaturedSubmission.id }}
        )
      }

      // Mark the passed submission as active one
      const activatedSubmission = await LaunchpadSubmission.update(
        { featured: true },
        { where: {id: submission.id }}
      )

      return res.status(200).json(activatedSubmission)
    } else {
      throw new Error("Submission details are not found")
    }
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const getFeaturedSubmission = async (req, res) => {
  try {
    const featuredSubmission = await LaunchpadSubmission.findOne({
      where: { featured: true }
    })

    if (featuredSubmission) {
      return res.status(200).json(featuredSubmission)
    } else {
      return res.status(200).json({})
    }
  } catch (error) {
    res.status(400).json({ message: error.message, datetime: new Date() })
  }
}

const findDuplicate = async (collectionName) => {
  const duplicateDocs = await LaunchpadSubmission.findAll({
    where: { collection_name: collectionName }
  })

  if (duplicateDocs.length > 0) {
    return {
      isSuccess: false,
      message: `${collectionName} already exists. Collection name should be unique`
    }
  } else {
    return {
      isSuccess: true,
      message: 'Collection name is valid'
    }
  }
}

module.exports = {
  addSubmission,
  getSubmissions,
  statusToApprove,
  findByCollectionName,
  findByMint,
  makrAsFeatured,
  getFeaturedSubmission,
}