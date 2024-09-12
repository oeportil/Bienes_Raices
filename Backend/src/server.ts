import express from 'express'
import exampleRoute from './Routes/ExampleRoute'

const server = express()
server.use(express.json())

//routes
server.use('/api/example', exampleRoute)

export default server