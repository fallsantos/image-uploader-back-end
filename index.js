const app = require('./app/config/server')

//const PORT = app.get('port')

app.listen(procces.env.PORT || 3000, () => {
    console.info(`Server running on port ${PORT}...`)
})