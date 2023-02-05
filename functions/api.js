//API Key: 33b77e0503fa4d50fe58ddf1e92d1654-us21
//UniqueID: c538c211d1

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const serverless = require("serverless-http");
const router = express.Router();

const app = express();

var PORT = 3000 || process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('../public'));
  app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);

var newPath = path.join(__dirname, '..', 'dist', '/');

app.get("/", function(req, res){
  // res.send("Server is running ");
  // console.log(newPath)
  res.sendFile(newPath + "/index.html");
  // console.log(__dirname + "/dist/signup.html");
  // res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.emailAddress;

  if( !firstName || !lastName || !email ){
    res.sendFile( newPath + '/failure.html');
    return;
  }

  const data = {
    members:[
      {
      email_address: email,
      status: 'subscribed',
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
  }

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us21.api.mailchimp.com/3.0/lists/c538c211d1',
    method: 'POST',
    headers: {
      Authorization: 'auth 33b77e0503fa4d50fe58ddf1e92d1654-us21'
    },
    body: postData
  }

  request(options, (err, response, body) => {
    if( err ){
      // res.send("Failed subscribed");
      res.sendFile(newPath +  '/failure.html');
    }else{
      if( response.statusCode === 200 ){
        // res.send("Successfully subscribed");
        res.sendFile(newPath + '/success.html');
      }
      else{
        // res.send("Failed subscribed");
        res.sendFile(newPath + '/failure.html');
      }
    }
  });

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(PORT, function(){
  console.log(`Server is running at: ${PORT}`);
});
