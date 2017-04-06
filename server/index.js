var express = require('express');
var cors = require('cors');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var bodyParser = require('body-parser');
var room = require('./room');

const app = express();
app.use(cors());
const port = 3000;

db.serialize(function() {
  db.run("CREATE TABLE players (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);");
});

app.use(bodyParser.json());

/**
 * @api {get} /players Get list of registered Players
 * @apiGroup Players
 * @apiSuccess {Object[]} players List of Players
 * @apiSuccess {Number} players.id Player ID
 * @apiSuccess {String} players.name Player name
 */
app.get("/players", function(req, res) {
  db.all("SELECT id, name FROM players;", function(err, players) {
    if (err) {
      console.error("Can't load players: %s", err.toString())
      res.sendStatus(500)
      return
    }
    res.json({players: players})
  })
});

/**
 * @api {post} /players Register a new Player
 * @apiGroup Players
 * @apiParam {String} name Player name
 */
app.post("/players", function(req, res) {
  let name = req.body.name;
  if (name) {
    db.run("INSERT INTO players (name) VALUES (?);", name);
    res.sendStatus(201);
    return
  }
  res.sendStatus(422);
})

/**
 * @api {post} /game Start a new Random Game
 * @apiGroup Game
 */
app.post("/game", function(req, res) {
  try {
    room.randomGame()
    res.sendStatus(200)
  } catch(e) {
    console.error(e)
    res.status(422).json(e)
  }
})

/**
 * @api {post} /game/finish Finish the current Game
 * @apiGroup Game
 * @apiParam {String} winner Winner team: "team1" or "team2"
 */
app.post("/game/finish", function(req, res) {
  let winner = req.body.winner
  if (winner !== "team1" && winner !== "team2") {
    return res.sendStatus(422)
  }
  room.endGame(req.body.winner)
  res.sendStatus(200)
})

/**
 * @api {post} /game/next Start the next Game
 * @apiGroup Game
 * @apiParam {String} winner Winner team: "team1" or "team2"
 */
app.post("/game/next", function(req, res) {
  let winner = req.body.winner
  if (winner !== "team1" && winner !== "team2") {
    return res.sendStatus(422)
  }
  room.nextGame(winner)
  res.sendStatus(200)
})

/**
 * @api {get} /room Get room status
 * @apiGroup Room
 * @apiSuccess {Player[]} queue Players queue
 * @apiSuccess {Integer} queue.id Player ID
 * @apiSuccess {Number} queue.name Player name
 * @apiSuccess {Object} game Game state
 * @apiSuccess {Object} game.team1 First Team
 * @apiSuccess {Object} game.team2 Second Team
 * @apiSuccess {Player} game.team1.goalkeeper Goalkeeper of the first team
 * @apiSuccess {Player} game.team1.forward Forward of the first team
 * @apiSuccess {Player} game.team2.goalkeeper Goalkeeper of the second team
 * @apiSuccess {Player} game.team2.forward Forward of the second team
 */
app.get("/room", function(req, res) {
  res.json(room);
})

/**
 * @api {post} /room/players Add player to the room
 * @apiGroup Room
 * @apiParam {Number} id Player ID
 */
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

/**
 * @api {delete} /room/players/:id Remove Player from Room
 * @apiGroup Room
 * @apiParam id Player ID
 */
app.delete("/room/players/:id", function(req, res) {
  room.delete(req.params.id)
  res.sendStatus(200)
})


app.listen(port, function() {
  console.log('Listening on :%d', port)
})

