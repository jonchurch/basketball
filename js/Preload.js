

var preload = function(game) {}

preload.prototype= {
  preload: function(){
    var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading')
    loadingBar.anchor.setTo(0.5)
    this.game.load.image('ball', 'assets/images/ball.png');
    this.game.load.image('hoop', 'assets/images/toilet_full.png');
    this.game.load.image('toilet_bottom', 'assets/images/toilet_bottom_morecropped.png')
      // this.game.load.image('hoop', 'assets/images/hoop.png');
    this.game.load.image('side rim', 'assets/images/side_rim.png');
    this.game.load.image('front rim', 'assets/images/front_rim.png');

    this.game.load.image('splash', 'assets/images/splash.png');
    this.game.load.image('win0', 'assets/images/win0.png');
    this.game.load.image('win1', 'assets/images/win1.png');
    this.game.load.image('win2', 'assets/images/win2.png');
    this.game.load.image('win3', 'assets/images/win3.png');
    this.game.load.image('win4', 'assets/images/win4.png');
    this.game.load.image('win5', 'assets/images/win5.png');
    this.game.load.image('lose0', 'assets/images/lose0.png');
    this.game.load.image('lose1', 'assets/images/lose1.png');
    this.game.load.image('lose2', 'assets/images/lose2.png');
    this.game.load.image('lose3', 'assets/images/lose3.png');
    this.game.load.image('lose4', 'assets/images/lose4.png');
    this.game.load.image('lose5', 'assets/images/lose5.png');

    this.game.load.audio('score', 'assets/audio/score.wav');
    this.game.load.audio('backboard', 'assets/audio/backboard.wav');
    this.game.load.audio('whoosh', 'assets/audio/whoosh.wav');
    this.game.load.audio('fail', 'assets/audio/fail.wav');
    this.game.load.audio('spawn', 'assets/audio/spawn.wav');
    this.game.load.audio('flush', 'assets/audio/flush.wav')

    this.game.state.start('Play')
  }
}
