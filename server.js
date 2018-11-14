const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./router');
var bodyParser = require('body-parser');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/EstoyAcaPorVos');

// Initialize http server
const app = express();

// Logger that outputs all requests into the console
app.use(morgan('combined'));

//Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ extended: true,limit: '50mb' }));

// Use v1 as prefix for all API endpoints
app.use('/v1', router);

const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});







