var rand;

rand = function(num) {
  return Math.floor(Math.random() * num);
};

Game.Load = function(game) {};

Game.Load.prototype = {
  preload: function() {
    var label2, preloading, preloading2;
    label2 = game.add.text(Math.floor(w / 2) + 0.5, Math.floor(h / 2) - 15 + 0.5, "loading...", {
      font: "30px Arial",
      fill: "#111"
    });
    label2.anchor.setTo(0.5, 0.5);
    preloading2 = game.add.sprite(w / 2, h / 2 + 15, "loading2");
    preloading2.x -= preloading2.width / 2;
    preloading = game.add.sprite(w / 2, h / 2 + 19, "loading");
    preloading.x -= preloading.width / 2;
    game.load.setPreloadSprite(preloading);
    game.load.spritesheet("player", "assets/images/player3.png", 24, 30);
    game.load.image("logo", "assets/images/logo3.png");
    game.load.image("success", "assets/images/success3.png");
    game.load.image("coin", "assets/images/coin.png");
    game.load.image("enemy", "assets/images/enemy.png");
    this.load.audio('coin', 'assets/sounds/coin.wav');
    this.game.load.tilemap("map1", "assets/levels/1.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("map2", "assets/levels/2.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("map3", "assets/levels/3.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("map4", "assets/levels/4.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap("map5", "assets/levels/5.json", null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image("tiles", "assets/images/tiles.png");
  },
  create: function() {
    game.state.start("Menu");
  }
};
