Game.Play = (game) ->
  dead = 0

Game.Play:: =
  create: ->
    # @physics.startSystem(Phaser.Physics.ARCADE)
    @cursor = @input.keyboard.createCursorKeys()
    @player = @add.sprite(w / 2 - 50, h / 2, "player")
    # @physics.enable(@player, Phaser.Physics.ARCADE)
    @player.body.collideWorldBounds = true
    @camera.follow @player, Phaser.Camera.FOLLOW_PLATFORMER
    @player.anchor.setTo 0.5, 0.5
    @coins_taken = 0
    @level = 1
    @dead = 0
    @playerJumpCount = 0
    @coins = game.add.group()
    @enemies = game.add.group()
    @labels = game.add.group()
    
    @coin_s = @add.sound('coin')
    @coin_s.volume = 0.2
    @dead_s = @add.sound('dead')
    @dead_s.volume = 0.3
    @jump_s = @add.sound('jump')
    @jump_s.volume = 0.2
    @next_level()
    return

  update: ->
    # console.log @physics
    @physics.collide @layer, @player
    @physics.overlap @player, @coins, @take_coin, null, this
    @physics.overlap @enemies, @layer, @enemy_collide, null, this
    @physics.overlap @enemies, @player, @player_dead, null, this
    @player_movements()
    @player_dead()  if @player.y < -30
    # console.log(@total_coins)
    # console.log(@coins_taken)
    if @total_coins is @coins_taken
      # console.log "Next"
      @next_level()
    return

  enemy_collide: (e, layer) ->
    # console.log(e)
    if e.move is "1"
      if e.direction < 0
        e.body.velocity.x = 100
      else
        e.body.velocity.x = -100
    else if e.move is "2"
      if e.direction < 0
        e.body.velocity.y = 100
      else
        e.body.velocity.y = -100
    e.direction = e.direction * -1
    return

  take_coin: (player, coin) ->
    return  unless coin.alive
    coin.alive = false
    t = @game.add.tween(coin.scale).to(
      x: 0
      y: 0
    , 200).start()
    t.onComplete.add (->
      @kill()
      return
    ), coin
    @coins_taken += 1
    @coin_s.play() if sound
    return

  
  # if (sound) this.coin_s.play();
  player_dead: (sprite, tile) ->
    dead += 1
    
    this.dead_s.play() if sound
    if @level is 6
      @player.reset w / 2 - 50, h / 2 - 100
    else
      @player.reset w / 2 - 50, h / 2
    @player.body.gravity.y = 0
    @coins.callAll "kill"
    @coins_taken = 0
    @map.createFromObjects "objects", 2, "coin", 0, true, false, @coins
    @coins.forEachAlive ((c) ->
      c.anchor.setTo 0.5, 0.5
      c.x += c.width / 2
      c.y -= c.width / 2
      t = game.add.tween(c).to(
        y: "-5"
      , 300).to(
        y: "+5"
      , 300)
      t.loop(true).start()
      return
    ), this
    return

  next_level: ->
    return  unless @player.alive
    @player.alive = false
    if @level is 1
      @load_map()
    else
      t = game.add.tween(@player).to(
        angle: 360
      , 600).start()
      @player.body.gravity.y = 0
      @player.body.velocity.x = 0
      @player.body.velocity.y = 0
      if @level is 6
        t.onComplete.add (->
          @game.state.start "Over"
          return
        ), this
      else
        t.onComplete.add @load_map, this
    return

  load_map: ->
    @clear_map()
    @map = @add.tilemap("map" + @level)
    @map.addTilesetImage "tiles_name", "tiles"
    @map.setCollisionBetween 0, 1
    @map.setTileIndexCallback 3, @player_dead, this
    @layer = @map.createLayer("layer")
    @map.createFromObjects "objects", 2, "coin", 0, true, false, @coins
    @map.createFromObjects "objects", 4, "enemy", 0, true, false, @enemies
    @map.createFromObjects "objects", 5, "enemy", 0, true, false, @enemies
    @map.createFromObjects "objects", 7, "", 0, true, false, @labels
    @layer.resizeWorld()
    @player.reset w / 2 - 50, h / 2
    @player.y -= 100  if @level is 5
    @level += 1
    @player.alive = true
    @total_coins = 0
    @coins_taken = 0
    @add_objects()
    return

  add_objects: ->
    @coins.forEachAlive ((c) ->
      @total_coins += 1
      c.anchor.setTo 0.5, 0.5
      c.x += c.width / 2
      c.y -= c.width / 2
      t = game.add.tween(c).to(
        y: "-5"
      , 300).to(
        y: "+5"
      , 300)
      t.loop(true).start()
      return
    ), this
    @enemies.forEachAlive ((e) ->
      if e.move is "1"
        e.body.velocity.x = 100
        e.direction = 1
      else if e.move is "2"
        e.body.velocity.y = 100
        e.direction = 1
      return
    ), this
    @labels.forEachAlive ((l) ->
      l.label = game.add.text(l.x, l.y, l.text,
        font: "22px Arial"
        fill: "#111"
      )
      l.label.anchor.setTo 0.5, 1
      l.label.x += 10
      return
    ), this
    return

  clear_map: ->
    @layer.destroy()  if @layer
    @coins.callAll "kill"
    @enemies.callAll "kill"
    @labels.forEachAlive ((l) ->
      l.label.destroy()
      l.kill()
      return
    ), this
    return

  player_movements: ->
    @player.body.velocity.x = 0
    return  unless @player.alive
    if @cursor.left.isDown
      if @player.scale.x is 1 or @player.frame is 0
        @player.scale.setTo -1, 1
        @player.frame = 1
      if @player.body.blocked.down
        @player.body.velocity.x = -250
      else
        @player.body.velocity.x = -200
    else if @cursor.right.isDown
      if @player.scale.x is -1 or @player.frame is 0
        @player.scale.setTo 1, 1
        @player.frame = 1
      if @player.body.blocked.down
        @player.body.velocity.x = 250
      else
        @player.body.velocity.x = 200
    else
      @player.frame = 0
    if @player.body.blocked.down
      @player.body.gravity.y = 200
    else
      @player.body.gravity.y = 500
    if @cursor.up.isDown and @player.body.blocked.down
      @player.body.velocity.y = -200
      
      @jump_s.play() if sound
      @playerJumpCount = 1
    else if @cursor.up.isDown and @playerJumpCount < 12 and @playerJumpCount isnt 0
      @playerJumpCount += 1
      @player.body.velocity.y = -250
    else
      @playerJumpCount = 0
    return
