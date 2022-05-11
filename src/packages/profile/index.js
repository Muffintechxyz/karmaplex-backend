const express = require('express')
const multer = require('multer')
const controller = require('./Profile.controller')
const router = express.Router()
const upload = multer()

module.exports = () => {
  router.post('/profile', upload.fields(
    [
      { name: 'image', maxCount: 1 }
    ]
  ), controller.addProfileInfo)
  router.get('/profile/:id', controller.getProfile)
  return router
}