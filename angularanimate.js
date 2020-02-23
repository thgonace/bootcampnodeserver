var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors())
app.route('/pages/:pagenumber').get(function (req, res) {
    
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://user:aEWrj65HzdzbWGd@cluster0-pgykr.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db("pages").collection("pages").find({example_number:req.param("pagenumber")}).toArray(function (err,cursor) {
            if (err) throw err;
            res.send(cursor);            
            client.close();
        });        
    });
});
var server = app.listen(80, function () { }); 
