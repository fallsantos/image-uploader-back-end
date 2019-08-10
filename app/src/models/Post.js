require('dotenv').config()

const mongoose = require('mongoose')

const aws = require('aws-sdk')

const fs = require('fs')

const path = require('path')

const { promisify } = require('util')// converte uma função que usa a forma antiga de callbacks para lidar com programação assíncrona, que o fs utilisa, para a nova forma, para poder usar o assinc / await / promises no geral.    

const s3 = new aws.S3

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true// Nome originl da imagem.
    },
    size: {
        type: Number,
        required: true
    },
    key: {
        type: String,
        required: true// Nome gerado com o hash.
    },
    url: {
        type: String,
        //required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})
//              ↓↓↓↓ Antes do save.
postSchema.pre('save', async function () {// Se a url estiver vazia(salvando em disco), preencherá com a url static. 
    if (!this.url) {        // ↑ formato padrão de função, pois a arrowfunction não tem aceso ao this*.     
        this.url = `${process.env.APP_URL}${process.env.PORT}/files/${this.key}`
    }
})

postSchema.pre('remove', async function () {
    if(process.env.STORAGE_TYPE == 's3')
    {
        return s3.deleteObject({
            Bucket: 'bucket-name',
            key: this.key
        }).promise()// Para retornar no formato de promise.
    }
    else
    {
        return promisify(fs.unlink)(
            path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key)
        )
    }
})

module.exports = mongoose.model('Post', postSchema)