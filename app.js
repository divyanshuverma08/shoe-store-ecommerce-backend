require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const mongo = process.env.DB;
const cors = require("cors");
const passport = require('passport');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
app.use(cors())

// Done: Set config Depending upon the Environment
const config = {
    dburl: `${mongo}`
}
try {
    mongoose.connect(config.dburl, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error);
}

const db = mongoose.connection;

db.on('connected', function () {
    console.log('Mongoose default connection established.');
});

db.on('close', function () {
    console.log('Mongoose connection closed.');
});

// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection ended.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

require("./service/googleStrategy");
require("./service/facebookStrategy");

app.use(require("./routes"))

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log("Server is listening at PORT - ",PORT);
})

