import express from "express";
import ExampleRoute from "./routes/ExampleRoutes.js";

const server = express();
server.use(express.json())
server.use('/api/example', ExampleRoute)
export default server;