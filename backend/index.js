require('dotenv').config()

const express = require('express')
const cors = require('cors')

const usersRouter = require('./routes/users')
const jobsRouter = require('./routes/jobs')
const postulacionesRouter = require('./routes/postulaciones')
const mensajesRouter = require('./routes/mensajes')
const adminRouter = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/postulaciones', postulacionesRouter)
app.use('/api/mensajes', mensajesRouter)
app.use('/api/admin', adminRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
