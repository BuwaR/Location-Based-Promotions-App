/**
 * Created by Buwaneka on 8/31/17.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var Router = require('./Router');

mongoose.connect('mongodb://127.0.0.1:27017/promotionApp',{
  useMongoClient: true,
  /* other options */
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}))
app.use(Router);
app.listen(3000, function(err) {
    console.log("Server running");
});
