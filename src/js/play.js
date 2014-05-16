Game.Play = function(game) {};

Game.Play.prototype = {
  create: function() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.player = this.add.sprite(w / 2 - 50, h / 2, "player");
    this.player.body.collideWorldBounds = true;
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    this.player.anchor.setTo(0.5, 0.5);
    this.coins_taken = 0;
    this.level = 1;
    this.dead = 0;
    this.playerJumpCount = 0;
    this.coins = game.add.group();
    this.enemies = game.add.group();
    this.labels = game.add.group();
    this.coin_s = this.add.sound('coin');
    this.coin_s.volume = 0.2;
    this.next_level();
  },
  update: function() {
    this.physics.collide(this.layer, this.player);
    this.physics.overlap(this.player, this.coins, this.take_coin, null, this);
    this.physics.overlap(this.enemies, this.layer, this.enemy_collide, null, this);
    this.physics.overlap(this.enemies, this.player, this.player_dead, null, this);
    this.player_movements();
    if (this.player.y < -30) {
      this.player_dead();
    }
    if (this.total_coins === this.coins_taken) {
      this.next_level();
    }
  },
  enemy_collide: function(e, layer) {
    if (e.move === "1") {
      if (e.direction < 0) {
        e.body.velocity.x = 100;
      } else {
        e.body.velocity.x = -100;
      }
    } else if (e.move === "2") {
      if (e.direction < 0) {
        e.body.velocity.y = 100;
      } else {
        e.body.velocity.y = -100;
      }
    }
    e.direction = e.direction * -1;
  },
  take_coin: function(player, coin) {
    var t;
    if (!coin.alive) {
      return;
    }
    coin.alive = false;
    t = this.game.add.tween(coin.scale).to({
      x: 0,
      y: 0
    }, 200).start();
    t.onComplete.add((function() {
      this.kill();
    }), coin);
    this.coins_taken += 1;
    if (sound) {
      this.coin_s.play();
    }
  },
  player_dead: function(sprite, tile) {
    dead += 1;
    if (this.level === 6) {
      this.player.reset(w / 2 - 50, h / 2 - 100);
    } else {
      this.player.reset(w / 2 - 50, h / 2);
    }
    this.player.body.gravity.y = 0;
    this.coins.callAll("kill");
    this.coins_taken = 0;
    this.map.createFromObjects("objects", 2, "coin", 0, true, false, this.coins);
    this.coins.forEachAlive((function(c) {
      var t;
      c.anchor.setTo(0.5, 0.5);
      c.x += c.width / 2;
      c.y -= c.width / 2;
      t = game.add.tween(c).to({
        y: "-5"
      }, 300).to({
        y: "+5"
      }, 300);
      t.loop(true).start();
    }), this);
  },
  next_level: function() {
    var t;
    if (!this.player.alive) {
      return;
    }
    this.player.alive = false;
    if (this.level === 1) {
      this.load_map();
    } else {
      t = game.add.tween(this.player).to({
        angle: 360
      }, 600).start();
      this.player.body.gravity.y = 0;
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      if (this.level === 6) {
        t.onComplete.add((function() {
          this.game.state.start("Over");
        }), this);
      } else {
        t.onComplete.add(this.load_map, this);
      }
    }
  },
  load_map: function() {
    this.clear_map();
    this.map = this.add.tilemap("map" + this.level);
    this.map.addTilesetImage("tiles_name", "tiles");
    this.map.setCollisionBetween(0, 1);
    this.map.setTileIndexCallback(3, this.player_dead, this);
    this.layer = this.map.createLayer("layer");
    this.map.createFromObjects("objects", 2, "coin", 0, true, false, this.coins);
    this.map.createFromObjects("objects", 4, "enemy", 0, true, false, this.enemies);
    this.map.createFromObjects("objects", 5, "enemy", 0, true, false, this.enemies);
    this.map.createFromObjects("objects", 7, "", 0, true, false, this.labels);
    this.layer.resizeWorld();
    this.player.reset(w / 2 - 50, h / 2);
    if (this.level === 5) {
      this.player.y -= 100;
    }
    this.level += 1;
    this.player.alive = true;
    this.total_coins = 0;
    this.coins_taken = 0;
    this.add_objects();
  },
  add_objects: function() {
    this.coins.forEachAlive((function(c) {
      var t;
      this.total_coins += 1;
      c.anchor.setTo(0.5, 0.5);
      c.x += c.width / 2;
      c.y -= c.width / 2;
      t = game.add.tween(c).to({
        y: "-5"
      }, 300).to({
        y: "+5"
      }, 300);
      t.loop(true).start();
    }), this);
    this.enemies.forEachAlive((function(e) {
      if (e.move === "1") {
        e.body.velocity.x = 100;
        e.direction = 1;
      } else if (e.move === "2") {
        e.body.velocity.y = 100;
        e.direction = 1;
      }
    }), this);
    this.labels.forEachAlive((function(l) {
      l.label = game.add.text(l.x, l.y, l.text, {
        font: "22px Arial",
        fill: "#111"
      });
      l.label.anchor.setTo(0.5, 1);
      l.label.x += 10;
    }), this);
  },
  clear_map: function() {
    if (this.layer) {
      this.layer.destroy();
    }
    this.coins.callAll("kill");
    this.enemies.callAll("kill");
    this.labels.forEachAlive((function(l) {
      l.label.destroy();
      l.kill();
    }), this);
  },
  player_movements: function() {
    this.player.body.velocity.x = 0;
    if (!this.player.alive) {
      return;
    }
    if (this.cursor.left.isDown) {
      if (this.player.scale.x === 1 || this.player.frame === 0) {
        this.player.scale.setTo(-1, 1);
        this.player.frame = 1;
      }
      if (this.player.body.blocked.down) {
        this.player.body.velocity.x = -250;
      } else {
        this.player.body.velocity.x = -200;
      }
    } else if (this.cursor.right.isDown) {
      if (this.player.scale.x === -1 || this.player.frame === 0) {
        this.player.scale.setTo(1, 1);
        this.player.frame = 1;
      }
      if (this.player.body.blocked.down) {
        this.player.body.velocity.x = 250;
      } else {
        this.player.body.velocity.x = 200;
      }
    } else {
      this.player.frame = 0;
    }
    if (this.player.body.blocked.down) {
      this.player.body.gravity.y = 200;
    } else {
      this.player.body.gravity.y = 500;
    }
    if (this.cursor.up.isDown && this.player.body.blocked.down) {
      this.player.body.velocity.y = -200;
      this.playerJumpCount = 1;
    } else if (this.cursor.up.isDown && this.playerJumpCount < 12 && this.playerJumpCount !== 0) {
      this.playerJumpCount += 1;
      this.player.body.velocity.y = -250;
    } else {
      this.playerJumpCount = 0;
    }
  }
};
