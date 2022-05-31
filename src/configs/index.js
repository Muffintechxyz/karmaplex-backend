let config = {}
const env = process.env.NODE_ENV

if (env === "Local") {
  config = {
    POSTGRES_HOST_ADDRESS: process.env.LOCAL_POSTGRES_HOST_ADDRESS,
    POSTGRES_USER_NAME: process.env.LOCAL_POSTGRES_USER_NAME,
    POSTGRES_PASSWORD: process.env.LOCAL_POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.LOCAL_POSTGRES_DATABASE,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_URL: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com'
  }
} else if (env === "Development") {
  config = {
    POSTGRES_HOST_ADDRESS: process.env.POSTGRES_HOST_ADDRESS,
    POSTGRES_USER_NAME: process.env.POSTGRES_USER_NAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_URL: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com'
  }
} else if (env === "nadun") {
  config = {
    POSTGRES_HOST_ADDRESS: process.env.NADUN_POSTGRES_HOST_ADDRESS,
    POSTGRES_USER_NAME: process.env.NADUN_POSTGRES_USER_NAME,
    POSTGRES_PASSWORD: process.env.NADUN_POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.NADUN_POSTGRES_DATABASE,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_URL: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com'
  }
}else {
  config = {
    POSTGRES_HOST_ADDRESS: process.env.POSTGRES_HOST_ADDRESS,
    POSTGRES_USER_NAME: process.env.POSTGRES_USER_NAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_URL: 'https://' + process.env.S3_BUCKET_NAME + '.s3.amazonaws.com'
  }
}

module.exports = config