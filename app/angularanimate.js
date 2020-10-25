var express = require('express');
var cors = require('cors');
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fetch = require('node-fetch');
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

app.get('/trade', function (req, res, next) {
    let body = {}
    if (req.query.search === "maps") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "stats": [{
                    "type": "and",
                    "filters": []
                }],
                "filters": {
                    "trade_filters": {
                        "filters": {
                            "price": {
                                "currency": "chaos"
                            }
                        }
                    },
                    "misc_filters": {
                        "filters": {
                            "map_tier": {
                                "min": 14,
                                "max": 16
                            }

                        }
                    }
                }
            },
            "sort": {
                "price": "asc"
            }
        }
    } else if (req.query.search === "spectrechest") {
        body = { "query": { "status": { "option": "online" }, "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_125218179" }] }], "filters": { "type_filters": { "disabled": false, "filters": { "category": { "option": "armour.chest" }, "rarity": { "option": "nonunique" } } } } }, "sort": { "price": "asc" } }

    } else if (req.query.search === "6Lspectrechest") {
        body = { "query": { "status": { "option": "online" }, "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_125218179" }] }], "filters": { "socket_filters": { "disabled": false, "filters": { "links": { "min": 6 } } }, "type_filters": { "filters": { "category": { "option": "armour.chest" }, "rarity": { "option": "nonunique" } } } } }, "sort": { "price": "asc" } }
    } else if (req.query.search === "6LBspectrechest") {
        body = { "query": { "status": { "option": "online" }, "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_125218179" }] }], "filters": { "socket_filters": { "disabled": false, "filters": { "links": { "min": 6, "b": 6 } } }, "type_filters": { "filters": { "category": { "option": "armour.chest" }, "rarity": { "option": "nonunique" } } } } }, "sort": { "price": "asc" } }
    } else if (req.query.search === "6L3B3Wspectrechest") {
        body = { "query": { "status": { "option": "online" }, "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_125218179" }] }], "filters": { "socket_filters": { "disabled": false, "filters": { "links": { "min": 6, "b": 3, "w": 3 } } }, "type_filters": { "filters": { "category": { "option": "armour.chest" }, "rarity": { "option": "nonunique" } } } } }, "sort": { "price": "asc" } }
    } else if (req.query.search === "3MLbonehelmet") {
        body = { "query": { "status": { "option": "online" }, "type": "Bone Helmet", "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_3604946673", "value": { "min": 3 }, "disabled": false }] }] }, "sort": { "price": "asc" } }
    } else if (req.query.search === "elderbonehelmet") {
        body = { "query": { "status": { "option": "online" }, "type": "Bone Helmet", "stats": [{ "type": "and", "filters": [] }], "filters": { "misc_filters": { "disabled": false, "filters": { "elder_item": { "option": "true" } } } } }, "sort": { "price": "asc" } }
    } else if (req.query.search === "mininondamagebonehelmet") {
        body = { "query": { "status": { "option": "online" }, "type": "Bone Helmet", "stats": [{ "type": "and", "filters": [{ "id": "explicit.stat_1589917703", "value": { "min": 20 }, "disabled": false }] }] }, "sort": { "price": "asc" } }
    }




    else if (req.query.search === "tabula") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "name": "Tabula Rasa",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "exalted") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Exalted Orb",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "divine") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Divine Orb",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "alteration") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Orb of Alteration",
                "stats": [{
                    "type": "and",
                    "filters": []
                }],
                "filters": {
                    "trade_filters": {
                        "filters": {
                            "price": {
                                "currency": "chaos"
                            }
                        }
                    }
                }
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "scour") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Orb of Scouring",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "fusing") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Orb of Fusing",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "alch") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Orb of Alchemy",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    } else if (req.query.search === "gcp") {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "type": "Gemcutter's Prism",
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    }
    else {
        body = {
            "query": {
                "status": {
                    "option": "online"
                },
                "stats": [{
                    "type": "and",
                    "filters": []
                }]
            },
            "sort": {
                "price": "asc"
            }
        }

    }
    let id = ''
    let results = ''

    fetch('https://www.pathofexile.com/api/trade/search/Heist',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        })
        .then(rs => rs.text())
        .then(body => {
            body = JSON.parse(body)
            id = body.id
            set = []
            for (let u = 0; u < 10 && u < (body.result.length); u++) {
                set.push(body.result[u])
            }

            let url = 'https://www.pathofexile.com/api/trade/fetch/' + set.map(res => (res)) + "?query=" + id
            console.log(url)
            fetch(url)
                .then(rs => rs.text())
                .then(body => res.json(JSON.parse(body)))
        });

})

app.listen(80, function () { });

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
        socket.emit('id', { 'id': socket.id });
        socket.join("room" + data.examplenumber);
        socket.examplenumber = data.examplenumber;
        num = NumClientsInRoom("room" + socket.examplenumber);

        console.log("connected:" + num);
        if (texts[data.examplenumber] == undefined) {
            texts[data.examplenumber] = text;
        }
        socket.emit('code', { 'code': texts[data.examplenumber] });

        console.log('sent:' + data.examplenumber);
    })
    socket.on('code', (data) => {
        //console.log(`message: ${data.msg}`);
        texts[data.examplenumber] = data.code;
        console.log('recieved:' + data.examplenumber + ":" + texts[data.examplenumber].length);
        AB.to("room" + data.examplenumber).emit('code', { 'code': texts[data.examplenumber], 'id': data.id });
    });
    socket.on('disconnect', () => {
        num = NumClientsInRoom("room" + socket.examplenumber);
        names = names.filter(function (value) { return value.id != socket.id });
        sendNames();
    });
    socket.on('editing', () => {
        var name = names.filter(function (value) { return value.id == socket.id; })[0].name;
        AB.to("room" + socket.examplenumber).emit('lock', { 'id': socket.id, 'name': name });
    });
    var sendNames = function () {
        var UsersInRoom = names.filter(function (value) { return value.room == ("room" + socket.examplenumber) });
        var sendnames = []
        UsersInRoom.forEach(name => sendnames.push(name.name));
        AB.to("room" + socket.examplenumber).emit('connected', { 'connected': sendnames });

    }
    socket.on('name', (data) => {
        names.push({ 'name': data.name, 'id': socket.id, 'room': "room" + socket.examplenumber })
        sendNames();
    });
})
