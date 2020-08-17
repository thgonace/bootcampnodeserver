var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:aEWrj65HzdzbWGd@cluster0-pgykr.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
app.use(cors())
app.route('/pages/:pagenumber').get(function (req, res) {
  client.connect(err => {
    if (err) throw err;
    collection = client.db("pages").collection("pages").find({ example_number: req.param("pagenumber") }).toArray(function (err, cursor) {
      if (err) throw err;
      res.send(cursor);
    });
  });
});
app.route('/scheduler').post(function (req, res) {
  console.log(req.body)
  client.connect(err => {
    if (err) throw err;
    if (req.body.doing === 'book') {
      client.db("projects").collection("Scheduler").insertOne({ Date: req.body.Date, TimeSlot: req.body.TimeSlot, Name: req.body.Name, Who: req.body.Who, What: req.body.What })
      res.send("added")
    }
    if (req.body.doing === 'unbook')
      client.db("projects").collection("Scheduler").remove({ Date: req.body.Date, TimeSlot: req.body.TimeSlot, Name: req.body.Name }, 1)
    if (req.body.doing === 'getting')
      collection = client.db("projects").collection("Scheduler").find({
        Date: {
          $gte: req.body.DateStart,
          $lt: req.body.DateEnd
        }
      }).toArray(function (err, cursor) {
        if (err) throw err;
        res.send(cursor);
      });
  });
});
var server = app.listen(80, function () { }); 
