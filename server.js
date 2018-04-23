const mongoose = require('mongoose');
const express = require('express');
require('./api/models/allModels');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://himanshu21092:Shanu4779@ds147659.mlab.com:47659/scthronedb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())


var routes = require('./api/routes/queueRoutes'); //importing route
routes(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);