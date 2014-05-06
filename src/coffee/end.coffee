Game.Endd = (game) ->

Game.Endd:: =
  create: ->
    game.camera.follow null
    game.camera.setPosition 0, 0
    @cursor = @game.input.keyboard.createCursorKeys()
    logo = game.add.sprite(w / 2, 150, "success")
    logo.anchor.setTo 0.5, 0.5
    logo.scale.setTo 0, 0
    game.add.tween(logo.scale).to(
      x: 1
      y: 1
    , 1000, Phaser.Easing.Bounce.Out).start()
    label = game.add.text(w / 2, h - 100, "you died " + dead + " times\n\npress the UP arrow key to restart",
      font: "25px Arial"
      fill: "#fff"
      align: "center"
    )
    label.anchor.setTo 0.5, 0.5
    label.alpha = 0
    game.add.tween(label).delay(500).to(
      alpha: 1
    , 500).start()
    game.add.tween(label).to(
      angle: 1
    , 500).to(
      angle: -1
    , 500).loop().start()
    @time = @game.time.now + 500
    return

  update: ->
    game.state.start "Play"  if @cursor.up.isDown and @time < @game.time.now
    return
