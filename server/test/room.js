var expect = require('chai').expect
var room = require('../room');

describe('room', function() {
  describe('room', function() {
    it('should return new room with game', function() {
      room.reset()
      expect(room.game).to.be.ok
    });
  });

  describe('add()', function() {
    it('should add player to queue', function() {
      room.reset()
      expect(room.queue).to.be.empty;
      room.add("player1");
      expect(room.queue).to.not.be.empty;
    });
  });

  describe('randomGame()', function() {
    it('should start random game on 4 players', function() {
      room.reset()
      expect(room.queue).to.be.empty;
      room.add("player1");
      room.add("player2");
      room.add("player3");
      room.add("player4");
      expect(room.queue.length).to.equal(4);
      room.randomGame();
      expect(room.queue).to.be.empty;
      expect(room.game.team1.full()).to.equal(true)
      expect(room.game.team2.full()).to.equal(true)
    });
  });

  describe('nextGame()', function() {
    it('should swap players in teams when 4 in room', function() {
      room.reset()
      room.add("player1");
      room.add("player2");
      room.add("player3");
      room.add("player4");
      let game = room.randomGame();
      let goalkeeper1 = game.team1.goalkeeper;
      let forward1 = game.team1.forward;
      let goalkeeper2 = game.team2.goalkeeper;
      let forward2 = game.team2.forward;
      room.endGame("team1")
      room.nextGame("team1")
      expect(game.team1.forward).to.equal(goalkeeper1)
      expect(game.team1.goalkeeper).to.equal(forward1)
      expect(game.team2.forward).to.equal(goalkeeper2)
      expect(game.team2.goalkeeper).to.equal(forward2)
    });

    it('should place "losing forward" to "goalkeeper" when 5 in room', function() {
      room.reset()
      room.add("player1");
      room.add("player2");
      room.add("player3");
      room.add("player4");
      room.add("player5");
      let game = room.randomGame();
      let goalkeeper1 = game.team1.goalkeeper;
      let forward1 = game.team1.forward;
      let goalkeeper2 = game.team2.goalkeeper;
      let forward2 = game.team2.forward;
      room.endGame("team1")
      room.nextGame("team1")
      expect(game.team1.forward).to.equal(goalkeeper1)
      expect(game.team1.goalkeeper).to.equal(forward1)
      expect(game.team2.forward).to.not.equal(goalkeeper2)
      expect(game.team2.goalkeeper).to.equal(forward2)
    });

    it('should swap losers when 6 in room', function() {
      room.reset();
      room.add("player1");
      room.add("player2");
      room.add("player3");
      room.add("player4");
      room.add("player5");
      room.add("player6");
      let game = room.randomGame();
      let goalkeeper1 = game.team1.goalkeeper;
      let forward1 = game.team1.forward;
      let goalkeeper2 = game.team2.goalkeeper;
      let forward2 = game.team2.forward;
      room.endGame("team1")
      room.nextGame("team1")
      room.endGame("team1")
      room.nextGame("team1")
      expect(game.team1.forward).to.equal(forward1)
      expect(game.team1.goalkeeper).to.equal(goalkeeper1)
      expect(game.team2.forward).to.equal(goalkeeper2)
      expect(game.team2.goalkeeper).to.equal(forward2)
    });

    it('loser goalkeeper should return as forward after 2 games when 7 in room', function() {
      room.reset();
      room.add("player1");
      room.add("player2");
      room.add("player3");
      room.add("player4");
      room.add("player5");
      room.add("player6");
      room.add("player7");
      let game = room.randomGame();
      let goalkeeper = game.team2.goalkeeper;
      for (let i = 0; i < 3; i++) {
        room.endGame("team1");
        room.nextGame("team1");
      }
      expect(game.team2.forward).to.equal(goalkeeper);
    });
  });
});
