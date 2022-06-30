const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const router = require('./router');

const app = express();

const port = process.env.PORT || 3000;


// *************************** CONNECTING TO MONGO DATABASE ***************************   
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = process.env.MongoDBURI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => { console.log("✅ | MongoDB Operational"); /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ },
  err => { console.log("❌ | MongoDB Error: " + err);/** handle initial connection error */ }
);;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// *************************** END CONNECTING TO MONGO DATABASE ***************************


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/', express.static(path.join(__dirname, 'views/incognito')))

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

app.use('/', router);

// home route
app.get('/', (req, res) =>{
	if (req.session.user) return res.redirect('/dashboard')
    res.render('base', { title : "Homework Helper | Beta"});
})

app.listen(port, ()=>{ console.log("✅ | Web System Operational")});