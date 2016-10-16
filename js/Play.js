

var play = function(game) {}

var qs, scoreObj;

var hoop,
  goal,
  left_rim,
  right_rim,
  ball,
  front_rim,
  toilet_bottom,
  current_score = 0,
  current_score_text,
  high_score = 0,
  high_score_text,
  current_best_text,
  twitter_link,
  toilet_bottom_group;

var score_sound,
  backboard,
  whoosh,
  fail,
  spawn,
  flush;

var moveInTween,
  fadeInTween,
  moveOutTween,
  fadeOutTween,
  splash,
  emoji,
  emojiName,
  moveInSplash,
  fadeInSplash;

var collisionGroup;

play.prototype = {
  tweenOut: tweenOut,
  makeRequest: makeRequest,
  hitRim: hitRim,
  createBall: createBall,
  click: click,
  release: release,
  launch: launch,

  create: function() {

    			qs = this.game.net.getQueryString()

    			this.game.physics.startSystem(Phaser.Physics.P2JS);

    			this.game.physics.p2.setImpactEvents(true);

    			this.game.physics.p2.restitution = 0.63;
    			this.game.physics.p2.gravity.y = 0;

    			collisionGroup = this.game.physics.p2.createCollisionGroup();

    			score_sound = this.game.add.audio('score');
    			backboard = this.game.add.audio('backboard');
    			backboard.volume = 0.5;
    			whoosh = this.game.add.audio('whoosh');
    			fail = this.game.add.audio('fail');
    			fail.volume = 0.1;
    			spawn = this.game.add.audio('spawn');
    			flush = this.game.add.audio('flush')

    			this.game.stage.backgroundColor = "#ffffff";

    			// high_score_text = this.game.add.text(450, 25, 'High Score\n' + high_score, { font: 'Arial', fontSize: '32px', fill: '#000', align: 'center' });
    			current_score_text = this.game.add.text(187, 395, '', {
    				font: 'Arial',
    				fontSize: '40px',
    				fill: '#000',
    				align: 'center'
    			}); // 300, 500
    			current_best_text = this.game.add.text(143, 440, '', {
    				font: 'Arial',
    				fontSize: '20px',
    				fill: '#000',
    				align: 'center'
    			}); // 230, 450
    			current_best_score_text = this.game.add.text(187, 395, '', {
    				font: 'Arial',
    				fontSize: '40px',
    				fill: '#00e6e6',
    				align: 'center'
    			}); // 300, 500
    			// twitter_link = this.game.add.text(155, 410, '@jonchurch', {font: 'Arial', fontSize: '16px', fill: 'blue', align: 'center'} )

    			hoop = this.game.add.sprite(127, 0, 'hoop'); // 141, 100
    			// hoop.add.child(current_score_text)
    			// hoop.add.child(current_best_text)
    			// hoop.add.child(current_best_score_text)
    			left_rim = this.game.add.sprite(144, 184, 'side rim'); // 241, 296
    			left_rim.visible = false
    			right_rim = this.game.add.sprite(263, 184, 'side rim'); // 398, 296
    			right_rim.visible = false

    			this.game.physics.p2.enable([left_rim, right_rim], false);

    			left_rim.body.setCircle(3);
    			left_rim.body.static = true;
    			left_rim.body.setCollisionGroup(collisionGroup);
    			left_rim.body.collides([collisionGroup]);

    			right_rim.body.setCircle(3);
    			right_rim.body.static = true;
    			right_rim.body.setCollisionGroup(collisionGroup);
    			right_rim.body.collides([collisionGroup]);

    			toilet_bottom_group = this.game.add.group()


    			this.createBall();


    			cursors = this.game.input.keyboard.createCursorKeys();

    			this.game.input.onDown.add(click, this);
    			this.game.input.onUp.add(release, this);

  },
  update: function() {

    			if (ball && ball.body.velocity.y > 0 && ball.body.y < 300 && ball.body.x > 150 && ball.body.y < 260) {
    				 if (toilet_bottom === undefined)  {
    					 toilet_bottom = this.game.add.sprite(127, 161, 'toilet_bottom');
    					 toilet_bottom_group.add(toilet_bottom)

    				 } else {
    					 toilet_bottom.visible = true
    				 }
    				toilet_bottom.bringToTop()
    				ball.body.collides([collisionGroup], hitRim, this);
    			}

    			if (ball && ball.body.velocity.y > 0 && ball.body.y > 188 && !ball.isBelowHoop) {
    				ball.isBelowHoop = true;
    				ball.body.collideWorldBounds = false;
    				var rand = Math.floor(Math.random() * 6);
    				if (ball.body.x > 151 && ball.body.x < 249) {
    					emojiName = "win" + rand;
    					current_score += 1;
    					current_score_text.text = current_score;
    					splash = true
    					splashLeft = this.game.add.sprite(188, 222, 'splash')
    					splashRight = this.game.add.sprite(205, 222, 'splash')
    					splashLeft.angle += -165
    					splashRight.angle += -100
    					splashLeft.scale.setTo(0.5, 0.5)
    					splashRight.scale.setTo(0.5, 0.5)
    					goal = true

    					score_sound.play();
    					flush.play()
    				} else {
    					splash = false
    					emojiName = "lose" + rand;
    					fail.play();
    					if (current_score > high_score) {
    						high_score = current_score;
    						// 	high_score_text.text = 'High Score\n' + high_score;
    						// Post highscore to Telegram??

    						scoreObj = {
    							score: current_score,
    							user_id: qs.user,
    							chat_id: qs.chat,
    							message_id: +qs.message
    						}
    						if (qs.telegram) {
    							makeRequest('POST', 'setScore', scoreObj).then(function(result) {
    								console.log('result:', result)

    							}).catch(function(err) {
    								console.log('Uh Oh!:', err)
    							})
    						}
    					}
    					current_score = 0;
    					current_score_text.text = '';
    					current_best_text.text = 'Current Best';
    					current_best_score_text.text = high_score;
    				}
    				emoji = this.game.add.sprite(165, 70, emojiName);
    				// emoji.scale.setTo(0.85, 0.85);
    				moveInTween = this.game.add.tween(emoji).from({
    					y: 150
    				}, 300, Phaser.Easing.Elastic.Out, true);
    				fadeInTween = this.game.add.tween(emoji).from({
    					alpha: 0
    				}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);

    					// remove win/lose emoji
    					moveInTween.onComplete.add(tweenOut, this);
    					// if (toilet_bottom.visible === true) {
    					// 	toilet_bottom.visible = false
    					// }

    				if (splash) {
    					moveInLeftSplash = this.game.add.tween(splashLeft).from({
    						y: 150
    					}, 500, Phaser.Easing.Elastic.Out, true);
    					fadeInLeftSplash = this.game.add.tween(splashLeft).from({
    						alpha: 0
    					}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
    					moveInRightSplash = this.game.add.tween(splashRight).from({
    						y: 150
    					}, 500, Phaser.Easing.Elastic.Out, true);
    					fadeInRightSplash = this.game.add.tween(splashRight).from({
    						alpha: 0
    					}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);

    				}
    			}

    			if (ball && ball.body.y > 250 && goal === true) {
    				this.game.physics.p2.gravity.y = 0;
    				ball.kill();
    				this.createBall();
    				goal = false
    				console.log('KILL IT!')
    			}
    			if (ball && ball.body.y > 1200) {
    				this.game.physics.p2.gravity.y = 0;
    				ball.kill();
    				this.createBall();
    			}
  },


}

function makeRequest(method, telegramMethod, body) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, 'https://score-server-nuyixvmmzi.now.sh/' + telegramMethod);
    // xhr.open(method, 'https://score-server-bynfolxqoq.now.sh/' + telegramMethod);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(JSON.stringify(body));
  });
}


		function tweenOut() {
			moveOutTween = this.game.add.tween(emoji).to({
				y: 50
			}, 600, Phaser.Easing.Elastic.In, true);
			if (splash) {
				moveOutRightSplash = this.game.add.tween(splashRight).to({
					y: 50
				}, 600, Phaser.Easing.Elastic.In, true);
				moveOutRightSplash.onComplete.add(function() {
					splashRight.kill();
			}, this)
				moveOutLeftSplash = this.game.add.tween(splashLeft).to({
					y: 50
				}, 600, Phaser.Easing.Elastic.In, true);
				moveOutLeftSplash.onComplete.add(function() {
					splashLeft.kill();
			}, this)
		}
			moveOutTween.onComplete.add(function() {
				emoji.kill();

			}, this);
			setTimeout(function() {
				fadeOutTween = this.game.add.tween(emoji).to({
					alpha: 0
				}, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
				if (splash) {
					fadeOutSplashLeft = this.game.add.tween(splashLeft).to({
						alpha: 0
					}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
					fadeOutSplashRight = this.game.add.tween(splashRight).to({
						alpha: 0
					}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
					splash.alive = false
				}
			}, 300);

		}
    		function hitRim() {

    			backboard.play();

    		}


        		function createBall() {

        			var xpos;
        			if (current_score === 0) {
        				xpos = 200;
        			} else {
        				xpos = 60 + Math.random() * 280;
        			}
        			spawn.play();
        			ball = this.game.add.sprite(xpos, 547, 'ball');
        			// ball = this.game.add.sprite(340, 547, 'ball');
        			this.game.add.tween(ball.scale).from({
        				x: 0.7,
        				y: 0.7
        			}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        			this.game.physics.p2.enable(ball, false);
        			ball.body.setCircle(60); // NOTE: Goes from 60 to 36
        			ball.launched = false;
        			ball.isBelowHoop = false;
        			toilet_bottom_group.add(ball)

        		}

            		var location_interval;
            		var isDown = false;
            		var start_location;
            		var end_location;


                		function click(pointer) {

                			var bodies = this.game.physics.p2.hitTest(pointer.position, [ball.body]);
                			if (bodies.length) {
                				start_location = [pointer.x, pointer.y];
                				isDown = true;
                				location_interval = setInterval(function() {
                					start_location = [pointer.x, pointer.y];
                				}.bind(this), 100);
                			}

                		}


                    function release(pointer) {

                      if (isDown) {
                        window.clearInterval(location_interval);
                        isDown = false;
                        end_location = [pointer.x, pointer.y];

                        if (end_location[1] < start_location[1]) {
                          var slope = [end_location[0] - start_location[0], end_location[1] - start_location[1]];
                          var x_traj = -800 * slope[0] / slope[1];
                          this.launch(x_traj);
                          console.log('slope =', slope)
                          console.log('x_traj =', x_traj)
                          console.log('slope =', slope)
                        }
                      }

                    }



                    		function launch(x_traj) {

                    			if (ball.launched === false) {
                    				ball.body.setCircle(36);
                    				ball.body.setCollisionGroup(collisionGroup);
                    				current_best_text.text = '';
                    				current_best_score_text.text = '';
                    				ball.launched = true;

                    				this.game.physics.p2.gravity.y = 3000;
                    				this.game.add.tween(ball.scale).to({
                    					x: 0.6,
                    					y: 0.6
                    				}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

                    				// ball.body.velocity.x = dummy //x_traj;
                    				ball.body.velocity.x = x_traj;
                    				ball.body.velocity.y = -1750;
                    				ball.body.rotateRight(x_traj / 3);
                    				whoosh.play();
                    			}
                        }
