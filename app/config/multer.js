require('dotenv').config()

const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const path = require('path')// N*
const crypto = require('crypto')// N*

const s3 = new aws.S3()// ↓↓↓ instância da aws.  

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                file.key = `${hash.toString('hex')}-${file.originalname}`// Converte os bites formados pelo crypto em formato exadecimal. e concatena com o nome original do arquivo.

                cb(null, file.key)
            })
        }
    }),

    s3: multerS3({
        s3: s3,// ↑↑↑ instância da aws.
        bucket: 'bucket-name',
        contentType: multerS3.AUTO_CONTENT_TYPE, // Para que o navegador entenda e abra o arquivo em tela, ao invés de forçar o download.
        acl: 'public-read',// permissão de leitura.
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                const fileName = `${hash.toString('hex')}-${file.originalname}`// Converte os bites formados pelo crypto em formato exadecimal. e concatena com o nome original do arquivo.

                cb(null, fileName)
            })
        }
    })

}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),// Para onde os arquivos do upload vão. 
    storage: storageTypes[process.env.STORAGE_TYPE],
    limit: {// Tamanho máximo dos arquivos 
        fileSize: 2 * 1024 * 1024 // 2 MB
    },
    fileFilter: (req, file, cb) => {// Filtrar o upload de arquivos.
        const allowedMimes = [// Formatos que serão aceitos.  
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        // Callback é uma função que será chamada assim que a verificação terminar.

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {// Caso o mimetype do arquivo não esteja na lista acima.
            cb(new Error('Invalid file type.'))
        }
    }
}