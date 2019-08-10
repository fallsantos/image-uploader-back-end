const router = require('express').Router()

const multer = require('multer')
const multerConfig= require('../../config/multer')

const postController = require('../controllers/postController')

router.post('/', multer(multerConfig).single('file'), postController.store)
                // Configurações do multer / tipo do upload 'símples' -> nome do campo.
router.get('/', postController.index)

router.delete('/:id', postController.delete)

module.exports = router