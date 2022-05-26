const LaunchpadSubmission = require('../launchpad_submission/LaunchpadSubmission.model')

/**
 * GET ALL COLLECTION TAGS RELATED DATA
 * @param {*} req 
 * @param {*} res 
 */
const getTags = async (req, res) => {
    try {
        const submissions = await LaunchpadSubmission.findAll()
        const data = submissions.map((item)=> {
            const tags = []
            if(item.categories?.primaryCategory){
                tags.push(item.categories.primaryCategory)
            }
            if(item.categories?.secondaryCategory){
                tags.push(item.categories.secondaryCategory)
            }
            return {
              creator_public_key:  item.creator_public_key,
              tags,
              collection_name_query_string: item.collection_name_query_string
            }
        })
        res.status(200).json({ data, datetime: new Date() })
        
    } catch (error) {
        res.status(400).json({ message: error.message, datetime: new Date() })
    }
}

/**
 * FIND TAGS BY COLLECTION NAME
 * @param {*} req 
 * @param {*} res 
 */
const getTag = async (req, res) => {
    try {
        const collectionName = req.params.id 
        let modifiedName = collectionName
        const isSpace = /\s/g.test(collectionName)

        if (isSpace) {
            modifiedName = collectionName.replace(/\s/g, '%')
        }

        const submissions = await LaunchpadSubmission.findOne({ where: { collection_name_query_string: modifiedName } })
        const tags = []
            if(submissions.categories?.primaryCategory){
                tags.push(submissions.categories.primaryCategory)
            }
            if(submissions.categories?.secondaryCategory){
                tags.push(submissions.categories.secondaryCategory)
            }
        res.status(200).json({ data:{
            creator_public_key: submissions.creator_public_key,
            tags,
            collection_name_query_string: submissions.collection_name_query_string
        }, datetime: new Date() })
        
    } catch (error) {
        res.status(400).json({ message: error.message, datetime: new Date() })
    }
}


module.exports = {
    getTags,
    getTag
}