const app = require('./app/config/server')

const PORT = app.get('port') 

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}...`)
})