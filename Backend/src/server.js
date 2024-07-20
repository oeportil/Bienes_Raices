import express from "express";
import corsOption from "./config/corsOptions.js";
import cors from 'cors';
import ExampleRoute from "./routes/ExampleRoutes.js";

const server = express();
server.use(cors())
server.use(express.json())
server.use('/api/example', ExampleRoute)
export default server;