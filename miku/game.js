enchant();

var otas = [];
var rensha_last = 0

combo = 0;
rate = 100;

window.onload = function() {
	var GAME_WIDTH = 320;
	var GAME_HEIGHT = 320;
	
	var OTA_INTERVAL = 5;
	var OTA_MAX = 5;
	var OTA_SAITEI = 1;
	var OTA_RAND = 5;
	var MIKU_UTA = 5;
	var rensha_interval = 5;
	
	var TIME_LIMIT = 39;
	
	// for debug
	var url = location.href;
	if (url.indexOf('?') != -1) {
		var param = url.substr(url.indexOf('?')+1).replace(/&/g, ';');
		eval(param);
	}
	
	var miku_center = {
		x:GAME_WIDTH / 2,
		y: 180,
	};
	
	function radFromMiku(e) {
		return Math.atan2(miku_center.y - e.y, e.x - miku_center.x);
	}
	
	function degFromMiku(e) {
		var rad = radFromMiku(e);
		var deg = rad * 180 / Math.PI;
		if (deg < 0) {
			return -deg - 90;
		} else {
			return 360 - deg - 90;
		}
	}
	
    game = new Game(GAME_WIDTH, GAME_HEIGHT);
    game.fps = 24;
    game.preload(
    		'kyun.wav', 'font.png', 'back.png',
    		'miku.png', 'onpu.gif',
    		'ota.png', 'ota2.png', 'ota3.png', 'effect0.gif',
    		'bgm.wav', 'voice_owari.wav', 'voice_hajime.wav'
    );
    
    game.onload = function() {
    	var bg = new Sprite(320, 320);
    	bg.image = game.assets['back.png'];
    	game.rootScene.addChild(bg);
    	
    	var scoreLabel = new ScoreLabel(0, 0);
    	game.rootScene.addChild(scoreLabel);
    	
    	var timeLabel = new TimeLabel(16, 16, 'countdown');
    	timeLabel.time = TIME_LIMIT;
    	game.rootScene.addChild(timeLabel);
    	
		var miku = new Sprite(36, 53);
		miku.x = miku_center.x - miku.width / 2
		miku.y = miku_center.y - miku.height / 2;
		miku.image = game.assets['miku.png'];
		miku.addEventListener('enterframe', function (e) {
			miku.frame = Math.floor(game.frame / MIKU_UTA) % 10;
		});
		
		function touchListener(e) {
			var rad = radFromMiku(e);
			var deg = degFromMiku(e);
			
			miku.scaleX = e.localX < miku.x ? 1 : -1;
			
			if (rensha_last + rensha_interval > game.frame) {
				return;
			}
			
			var onpu = new Sprite(16, 15);
			onpu.x = miku.x + 12;
			onpu.y = miku.y + miku.height / 2;
			onpu.image = game.assets['onpu.gif'];
			onpu.frame = game.frame % 3;
			onpu.rotation = deg;
			
			var speed = 10;
			var vectorX = Math.cos(rad) * speed;
			var vectorY = -Math.sin(rad) * speed;
			onpu.addEventListener('enterframe', function (e) {
				onpu.x += vectorX;
				onpu.y += vectorY;
				if (onpu.x < -32 || game.width < onpu.x || onpu.y < -32 || game.height < onpu.y) {
					combo = 0;
					rate = 100;
					rensha_interval = 5;
					game.rootScene.removeChild(onpu);
				}
				
				var del_flag = false;
				otas = otas.filter(function (ota) {
					if (onpu.intersect(ota)) {
						scoreLabel.score = scoreLabel.score + 1 * (rate / 100);
						
						combo++;

						if (ota.ota_type == 'rate') {
							rensha_interval--;
							if (rensha_interval == 0) rensha_interval++;
							rate = rate + 25;
							if (combo >= 2) {
								var rateText = new RateText(ota.x - 6, ota.y - 40);
							} else {
								var rateText = new RateText(ota.x - 6, ota.y - 20);
							}
							rateText.text = ";" + ("" + (rate / 100)).replace(/\./, ":");
							rateText.fadeOut(24);
							game.rootScene.addChild(rateText);
						}
						
						if (combo >= 2) {
							scoreLabel.score = scoreLabel.score + ((125 * rate * combo) / 10000) ;
							var comboText = new ComboText(ota.x - 6, ota.y - 20);
							comboText.text = combo + ":;<";
							comboText.fadeOut(24);							
							game.rootScene.addChild(comboText);
						}
						
						if (ota.ota_type == 'time') {
							timeLabel.time = (timeLabel.time / game.fps) + 5;
						}
						
						del_flag = true;
						ota.removeEventListener('enterframe', ota.move);
						ota.frame = 3;
						ota.fadeOut(12);
						var kyunSound = game.assets['kyun.wav'].clone();
						kyunSound.play();
						
						var kyun = new KyunSprite(16, 16);
		        		kyun.x = ota.x-3;
		        		kyun.y = ota.y-10;
		        		kyun.blast(5);
		        		game.rootScene.addChild(kyun);
		        		
						return false;
					}
					return true;
				});
				if (del_flag) {
					game.rootScene.removeChild(onpu);
				}
			});
			rensha_last = game.frame;
			game.rootScene.addChild(onpu);
		}
		
		game.rootScene.addEventListener('touchstart', touchListener);
		game.rootScene.addEventListener('touchmove', touchListener);
		
		game.rootScene.addChild(miku);
		
		function soundOnce() {
			game.assets['voice_hajime.wav'].play();
			game.assets['bgm.wav'].play();
			game.rootScene.removeEventListener('enterframe', soundOnce);
		}
		game.rootScene.addEventListener('enterframe', soundOnce);
		
		var duration = game.assets['bgm.wav'].duration;
		function soundBgm() {
			if (game.assets['bgm.wav'].currentTime == duration) {
				game.assets['bgm.wav'].play();
			}
		}
		game.rootScene.addEventListener('enterframe', soundBgm);
		
		
		game.rootScene.addEventListener('enterframe', function (e) {
			if (timeLabel.time <= 0) {
				timeLabel.time = 0;
				game.end(scoreLabel.score, scoreLabel.score + 'キュン集めたよ');
				game.assets['voice_owari.wav'].play();
				game.assets['bgm.wav'].stop();
			}
			
			if (game.frame % OTA_INTERVAL == 0 && otas.length <= OTA_MAX) {
				var ota = new ExSprite(28, 39);
				
				var direction = rand(2) ? 1 : -1;
				ota.x = direction == 1 ? -32 : game.width;
				ota.y = rand(2) ? rand(96) + 32 : rand(96) + 192;
				
				var ota_rand = rand(15);
				
				if (ota_rand > 13) {
					ota.image = game.assets['ota3.png'];
					ota.speed = 6;
					ota.ota_type = 'time';
				} else if (ota_rand > 10) {
					ota.image = game.assets['ota2.png'];
					ota.speed = 7;
					ota.ota_type = 'rate';
				} else {
					ota.image = game.assets['ota.png'];
					ota.speed = rand(OTA_RAND) + OTA_SAITEI;
					ota.ota_type = 'normal';
				}
				
				ota.scaleX *= direction;
				
				var speed = direction * ota.speed;
				var move = function (e) {
					ota.x = ota.x + speed;
					ota.frame = Math.floor(game.frame / 3) % 3;
					if (ota.x < -32 || game.width < ota.x || ota.y < 0 || game.height < ota.y) {
						game.rootScene.removeChild(ota);
						var index = otas.indexOf(ota);
						if (index != -1) {
							otas.splice(index, 1);
						}
					}
				}
				ota.addEventListener('enterframe', move);
				game.rootScene.addChild(ota);
				otas.push(ota);
			}
		});
    };
    game.start();
};
