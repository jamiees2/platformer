var Game, dead, sound;

Game = window.Game = {};

sound = true;

dead = 0;

Game.Boot = function(game) {};

Game.Boot.prototype = {
  preload: function() {
    game.stage.backgroundColor = "#FFDE00";
    game.load.image("loading", "assets/images/loading.png");
    game.load.image("loading2", "assets/images/loading2.png");
  },
  create: function() {
    this.game.state.start("Load");
  }
};
