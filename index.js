const app = require('./app/config/server')

const PORT = app.get('port')

app.listen(PORT || 3000, () => {
    console.info(`Server running on port ${PORT}...`)
})