require('dotenv').config()

const express = require('express')

const morgan = require('morgan')

const path = require('path')

const app = express()

app.use(express.json())// Lidar com corpo de requisições no formato json.

app.use(express.urlencoded({ extended: true }))// Manipular dados codificados em url.

app.use(morgan('dev'))

app.use(require('../src/routes/routes'))

// Liberto o acesso a arquivos estáticos / encontra os arquivos dentro da pasta files.
app.use('/files', express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads')))

app.set('port', process.env.PORT)

require('./db')

module.exports = app