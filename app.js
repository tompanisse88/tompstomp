//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const request = require("superagent");
//const https = require("https");
const date = require(__dirname + "/date.js");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

console.log(date.getDate());

//connection to tompstomp mongoDB
mongoose.connect("mongodb+srv://dbUser:dbUserPassword@cluster0.lnn2w.mongodb.net/tompstomp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open", function(){
  console.log("connection made");
}).on("error", function(error){
  console.log("ERROR IS:", error);
});

//database schema
const stompSchema = new mongoose.Schema({
  user: String,
  date: Date,
  text: String
});
//database Model
const MessageModel = new mongoose.model("messagemodel", stompSchema);

const stompsArray = [];
const stompDate = [];
const stompUser = [];

MessageModel.find(function(err, stomps) {
  if(err) {
    console.log(err);
  } else {
    stomps.forEach(function(stomp){
      stompsArray.push(stomp.text);
      stompDate.push(stomp.date);
      stompUser.push(stomp.user);
    });
  }
});

app.get("/", function(req, res) {
  res.set("Content-Type", "text/html");
  res.render('index', {date: stompDate, dateToday: date.getDate(), stomps: stompsArray, user: stompUser });
});

app.get("/deletemany", function(req, res) {
  res.set("Content-Type", "text/html");
  MessageModel.deleteMany({user: "Tom Nilsson"}).then(function() {
    console.log("deleted");
  });
  res.redirect("/");
});

app.post("/", function(req, res) {

  const stomp = new MessageModel({
    user: "Tom Nilsson",
    date: date.getDate(),
    text: req.body.stomp
  });
  stomp.save();
  stompsArray.push(req.body.stomp);
  stompDate.push(stomp.date);
  stompUser.push(stomp.user)
  res.redirect("/");
});

/*
var mailchimpInstance   = 'us1',
    listUniqueId        = 'c20b4146b8',
    mailchimpApiKey     = 'ef51fbdd54bc73bb5eafdbd834a0494b-us1';

app.post('/login', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('tompanisse:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.email,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.fName,
            'LNAME': req.body.lName
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname + "/success.html");
              } else {
                res.sendFile(__dirname + "/failure.html");
              }
          });

});*/

app.listen(process.env.PORT || 3000, function(){
  console.log("App running on port 3000");
});
//API KEY
//458303586b26845f8c82f8c9166b8639-us1

//audience id (list-id)
//c20b4146b8

//mongo "mongodb+srv://cluster0.lnn2w.mongodb.net/myFirstDatabase" --username dbUser
