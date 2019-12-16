const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

module.exports = server;