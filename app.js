require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const morgan = require('morgan');

app.use(morgan('dev'))
app.use(express.json())

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const router = require('./api');
app.use('/api', router);

const client = require('./db/client');
client.connect();

app.use('*',(req, res) => {
    res.status(404).send({ message: '404 Not Found' })
})

module.exports = app;