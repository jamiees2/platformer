Game = window.Game = {}
sound = true
dead = 0

Game.Boot = (game) ->

Game.Boot:: =
  preload: ->
    game.stage.backgroundColor = "#F0F0F0"
    game.load.image "loading", "assets/images/loading.png"
    game.load.image "loading2", "assets/images/loading2.png"
    return

  create: ->
    @game.state.start "Load"
    return