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
}

class Room {
  constructor() {
    this.players = [];
    this.queue = [];
  }

  add(player) {
    this.queue.push(player);
  }

  randomGame() {
    if (this.queue.length < 4) {
      throw new Error("At least 4 players required for the game");
    }

    let game = new Game();
    for (let i = 0; i < 4; i++) {
      let nextIndex = Math.floor(Math.random() * this.queue.length);
      let player = this.queue.splice(nextIndex, 1)[0];
      game.randomAdd(player);
    }
    return game
  }
}

class Player {
  constructor(name) {
    this.name = name;
  }
}

let room = new Room();
room.add("Joshua");
room.add("Robert");
room.add("Raymond");
room.add("Brian");
room.add("Peter");
let game = room.randomGame();
console.log(game);

