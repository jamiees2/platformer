Game.Menu = function(game) {};

Game.Menu.prototype = {
  create: function() {
    var label, logo;
    this.cursor = this.game.input.keyboard.createCursorKeys();
    logo = game.add.sprite(w / 2, -150, "logo");
    logo.anchor.setTo(0.5, 0.5);
    game.add.tween(logo).to({
      y: 150
    }, 1000, Phaser.Easing.Bounce.Out).start();
    label = game.add.text(w / 2, h - 50, "press the UP arrow key to start", {
      font: "25px Arial",
      fill: "#111"
    });
    label.anchor.setTo(0.5, 0.5);
    label.alpha = 0;
    game.add.tween(label).delay(500).to({
      alpha: 1
    }, 500).start();
    game.add.tween(label).to({
      angle: 1
    }, 500).to({
      angle: -1
    }, 500).loop().start();
  },
  update: function() {
    if (this.cursor.up.isDown) {
      this.game.state.start("Play");
    }
  }
};
