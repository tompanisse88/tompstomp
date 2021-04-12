//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("superagent");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(__dirname + "/index.html");
});

var mailchimpInstance   = 'us1',
    listUniqueId        = 'c20b4146b8',
    mailchimpApiKey     = '458303586b26845f8c82f8c9166b8639-us1';

app.post('/', function (req, res) {
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

});




app.listen(process.env.PORT || 3000, function(){
  console.log("App running on port 3000");
});
//API KEY
//458303586b26845f8c82f8c9166b8639-us1

//audience id (list-id)
//c20b4146b8
