const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

module.exports = server;