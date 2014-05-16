var game, h, w;

w = 600;

h = 400;

game = new Phaser.Game(w, h, Phaser.AUTO, "game");

game.state.add("Boot", Game.Boot);

game.state.add("Load", Game.Load);

game.state.add("Menu", Game.Menu);

game.state.add("Over", Game.Over);

game.state.add("Play", Game.Play);

game.state.start("Boot");
