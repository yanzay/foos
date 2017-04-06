var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var bodyParser = require('body-parser');
var room = require('./room');

const app = express();
const port = 3000;

db.serialize(function() {
  db.run("CREATE TABLE players (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);");
});

app.use(bodyParser.json());

/**
 * @api {get} /players Request all players
 * @apiGroup Players
 * @apiSuccess {Object[]} `[]` Array of players
 * @apiSuccess {Number} [].id User ID
 * @apiSuccess {String} [].name User name
 *
**/
app.get("/players", function(req, res) {
  db.all("SELECT id, name FROM players;", function(err, players) {
    if (err) {
      console.error("Can't load players: %s", err.toString())
      res.sendStatus(500)
      return
    }
    res.json(players)
  })
});

app.post("/players", function(req, res) {
  let name = req.body.name;
  if (name) {
    db.run("INSERT INTO players (name) VALUES (?);", name);
    res.sendStatus(201);
    return
  }
  res.sendStatus(400);
})

app.post("/game", function(req, res) {
  try {
    room.randomGame()
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.post("/game/win", function(req, res) {
  room.game.endGame(req.body.winner)
  res.sendStatus(200)
})

app.post("/game/next", function(req, res) {
  room.game.nextGame(req.body.winner)
  res.sendStatus(200)
})

app.get("/room", function(req, res) {
  res.json(room);
})

app.delete("/room", function(req, res) {
  room.reset()
  res.sendStatus(200)
})

app.post("/room/players", function(req, res) {
  db.all("SELECT id, name FROM players WHERE id = ?", req.body.id, function(err, players) {
    if (err) {
      console.error("Can't load players: %s", err.toString())
      res.sendStatus(500)
      return
    }
    if (players.length == 0) {
      console.error("Can't find player with id %d", req.body.id)
      res.sendStatus(404)
      return
    }
    room.add(players[0])
    res.sendStatus(200)
  })
})

app.delete("/room/players", function(req, res) {
  room.delete(req.body.id)
})


app.listen(port, function() {
  console.log('Listening on :%d', port)
})

