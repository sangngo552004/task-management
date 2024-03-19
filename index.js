const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const database = require("./config/database");
const bodyParser = require('body-parser');
const cors = require('cors');

const routesApiVer1 = require("./api/v1/routes/index.route");


database.connect();

const app = express();
const port = process.env.PORT;

app.use(cors()); //cho phep frontend truy cap api

// parse application/json
app.use(bodyParser.json());

// API ROUTES
routesApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});