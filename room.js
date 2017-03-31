class Team {
  constructor() {
    this.goalkeeper = null;
    this.forward = null;
  }

  randomAdd(player) {
    if (Math.random() < 0.5) {
      if (!this.goalkeeper) {
        this.goalkeeper = player;
        return true;
      }
    }
    if (!this.forward) {
      this.forward = player;
      return true;
    }
    if (!this.goalkeeper) {
      this.goalkeeper = player;
      return true;
    }
    return false;
  }

  swap() {
    [this.goalkeeper, this.forward] = [this.forward, this.goalkeeper]
  }

  leave() {
    return [this.goalkeeper, this.forward]
  }

  full() {
    return !!this.goalkeeper && !!this.forward
  }
}

class Game {
  constructor() {
    this.team1 = new Team();
    this.team2 = new Team();
  }

  randomAdd(player) {
    if (Math.random() < 0.5) {
      if (this.team1.randomAdd(player)) {
        return true;
      }
    }
    if (this.team2.randomAdd(player)) {
      return true;
    }
    return this.team1.randomAdd(player);
  }

  start() {
    this.started = true;
  }

  end(winner) {
    if (winner === "team1") {
      this._saveResults(this.team1, this.team2)
    } else {
      this._saveResults(this.team2, this.team1)
    }
    this.started = false
  }

  _saveResults(winTeam, loseTeam) {
    let res = {
      winGoalkeeper: winTeam.goalkeeper,
      winForward: winTeam.forward,
      loseGoalkeeper: loseTeam.goalkeeper,
      loseForward: loseTeam.forward,
    }
  }
}

class Room {
  constructor() {
    this.queue = []
    this.game = new Game()
  }

  reset() {
    this.queue = []
    this.game = new Game()
  }

  add(player) {
    this.queue.push(player)
  }

  delete(playerId) {
    this.queue = this.queue.filter((player) => { return player.id != playerId })
  }

  randomGame() {
    if (this.queue.length < 4) {
      throw new Error("At least 4 players required for the game")
    }

    for (let i = 0; i < 4; i++) {
      let nextIndex = Math.floor(Math.random() * this.queue.length)
      let player = this.queue.splice(nextIndex, 1)[0]
      this.game.randomAdd(player)
    }
    return this.game
  }

  endGame(winner) {
    var goalkeeper, forward;
    if (winner === "team1") {
      [goalkeeper, forward] = this.game.team2.leave()
    } else {
      [goalkeeper, forward] = this.game.team1.leave()
    }
    this.queue.push(forward)
    this.queue.push(goalkeeper)
  }

  nextGame(winner) {
    if (winner === "team1") {
      this.game.team1.swap()
      this.game.team2.forward = this.queue.shift()
      this.game.team2.goalkeeper = this.queue.shift()
      if (this.queue.length % 2 === 0) {
        this.game.team2.swap()
      }
    } else {
      this.game.team2.swap()
      this.game.team1.forward = this.queue.shift()
      this.game.team1.goalkeeper = this.queue.shift()
      if (this.queue.length % 2 === 0) {
        this.game.team1.swap()
      }
    }
  }
}

module.exports = new Room()
