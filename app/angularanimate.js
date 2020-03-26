var express = require('express');
var cors = require('cors');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
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
var serv = app.listen(80, function () { });

const port = 9999;
var text = `<!DOCTYPE html>
<html>
    <head>
        <title>Example 1</title>
        <style></style>
    </head>
    <body ng-app="app">
        <div ng-controller="controller">
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular-animate.js"></script>
        <script>
            var app = angular.module('app', ["ngAnimate"]);
            app.controller('controller', ['$animate', '$scope', function ($animate, $scope) {}])
        </script>
    </body>
</html>`

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
function NumClientsInRoom(room) {
    if (io.nsps['/angularbootcamp'].adapter.rooms[room]) {
        var clients = io.nsps['/angularbootcamp'].adapter.rooms[room].sockets;
        return Object.keys(clients).length;
    } else {
        return 0;
    }
}
const AB = io.of('/angularbootcamp');
var names = [];
var texts = [];
AB.on('connection', (socket) => {
	console.log("connection");
    socket.on('join', (data) => {
	socket.emit('id', { 'id': socket.id});	
        socket.join("room" + data.examplenumber);
        socket.examplenumber = data.examplenumber;
        num = NumClientsInRoom("room" + socket.examplenumber);
	
        console.log("connected:" +num );
        if (texts[data.examplenumber] == undefined) {
            texts[data.examplenumber] = text;
        }
        socket.emit('code', { 'code': texts[data.examplenumber]});
	
        console.log('sent:'+ data.examplenumber);
    })
    socket.on('code', (data) => {
        //console.log(`message: ${data.msg}`);
        texts[data.examplenumber] = data.code;
        console.log('recieved:'+ data.examplenumber +":"+ texts[data.examplenumber].length);
        AB.to("room" + data.examplenumber).emit('code', { 'code': texts[data.examplenumber] ,'id':data.id});
    });
    socket.on('disconnect', () => {        
        num = NumClientsInRoom("room" + socket.examplenumber);
	names = names.filter(function(value) {return value.id != socket.id});
	sendNames();
    });
	socket.on('editing',() => {
		var name = names.filter(function(value){return value.id == socket.id;})[0].name;
		AB.to("room" + socket.examplenumber).emit('lock', { 'id': socket.id,'name':name});
	});
	var sendNames = function(){
		var UsersInRoom = names.filter(function(value) {return value.room==("room" + socket.examplenumber)});
		var sendnames = []
		UsersInRoom.forEach(name=> sendnames.push(name.name));		
       		AB.to("room" + socket.examplenumber).emit('connected', { 'connected': sendnames });

	}
	socket.on('name',(data) => {
		names.push({'name':data.name,'id':socket.id,'room': "room"+socket.examplenumber})
		sendNames();
	});
})
