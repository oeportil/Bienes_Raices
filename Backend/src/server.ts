import express from "express";
import RealRouter from "./Routes/RealStateRoute";
import UserRouter from "./Routes/UserRoute";
import AuctionRouter from "./Routes/AuctionRoute";

import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());

//routes

server.use("/api/realstates", RealRouter);
server.use("/api/users", UserRouter);
server.use("/api/auction", AuctionRouter);

export default server;
