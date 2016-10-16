

var boot = function(game) {
  console.log('Booting game...');
}

boot.prototype ={
  preload: function(){
    this.game.load.image('loading', 'assets/images/ball.png')

  },
  create: function(){
    // Setup game size and scale
    if (this.game.device.desktop == false) {
      // Set Scaling mode to SHOW_ALL to show all the game
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

      // Set A minimum and maximum size for the game
      this.game.scale.setMinMax(this.game.width / 2, this.game.height / 2, this.game.width, this.game.height)

    }

    // Center the game horizontally and veritcally
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAligthVertically = true

    this.game.state.start('Preload')
  }

}
