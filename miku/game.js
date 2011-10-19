enchant();

var otas = [];
var rensha_last = 0

window.onload = function() {
	var GAME_WIDTH = 320;
	var GAME_HEIGHT = 320;
	
	var OTA_INTERVAL = 5;
	var OTA_MAX = 5;
	var ota_speed_f = function () {
		return rand(10) + 5;	// 5 ~ 15
	}
	
	var RENSHA_INTERVAL = 5;
	
	// for debug
	var url = location.href;
	if (url.indexOf('?') != -1) {
		var param = url.substr(url.indexOf('?')+1).replace(/&/g, ';');
		eval(param);
	}
	
	var miku_center = {
		x:GAME_WIDTH / 2,
		y: 172,
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
    game.preload('font.png', 'back.png', 'miku.png', 'onpu.gif', 'ota.png', 'kyun.wav');
    game.onload = function() {
    	var bg = new Sprite(320, 320);
    	bg.image = game.assets['back.png'];
    	game.rootScene.addChild(bg);
    	
		var miku = new Sprite(20, 28);
		miku.x = miku_center.x - miku.width / 2
		miku.y = miku_center.y - miku.height / 2;
		miku.image = game.assets['miku.png'];
		miku.frame = 1;
		miku.addEventListener('enterframe', function (e) {
			miku.frame = Math.floor(game.frame / 2) % 3;
		});
		
		game.rootScene.addEventListener('touchstart', function (e) {
			var rad = radFromMiku(e);
			var deg = degFromMiku(e);
			
			miku.rotation = deg;
			
			var onpu = new Sprite(16, 15);
			onpu.x = miku.x + 1;
			onpu.y = miku.y + 5;
			onpu.image = game.assets['onpu.gif'];
			onpu.frame = game.frame % 3;
			onpu.rotation = deg;
			onpu.addEventListener('enterframe', function (e) {
				var speed = 10;
				var vectorX = Math.cos(rad) * speed;
				var vectorY = -Math.sin(rad) * speed;
				onpu.x += vectorX;
				onpu.y += vectorY;
				if (onpu.x < -32 || game.width < onpu.x || onpu.y < -32 || game.height < onpu.y) {
					game.rootScene.removeChild(onpu);
				}
				
				var del_flag = false;
				otas = otas.filter(function (x) {
					if (onpu.intersect(x)) {
						del_flag = true;
						game.rootScene.removeChild(x);
						game.assets['kyun.wav'].play();
						return false;
					}
					return true;
				});
				if (del_flag) {
					game.rootScene.removeChild(onpu);
				}
			});
			
			if (rensha_last + RENSHA_INTERVAL < game.frame) {
				rensha_last = game.frame;
				game.rootScene.addChild(onpu);
			}
		});
		
		game.rootScene.addEventListener('touchmove', function (e) {
			var deg = degFromMiku(e);
			miku.rotation = deg;
		});
		
		game.rootScene.addChild(miku);
		
		game.rootScene.addEventListener('enterframe', function (e) {
			if (game.frame % OTA_INTERVAL == 0) {
				var ota = new ExSprite(26, 39);
				var direction = rand(2) ? 1 : -1;
				ota.x = direction == 1 ? -32 : game.width;
				ota.y = rand(2) ? rand(96) + 32 : rand(96) + 192;
				ota.image = game.assets['ota.png'];
				ota.scaleX *= direction;
				
				var speed_f = ota_speed_f;
				ota.addEventListener('enterframe', function (e) {
					ota.x = ota.x + direction * speed_f();
					ota.frame = Math.floor(game.frame / 2) % 3;
					if (ota.x < -32 || game.width < ota.x || ota.y < 0 || game.height < ota.y) {
						game.rootScene.removeChild(ota);
						var index = otas.indexOf(ota);
						if (index != -1) {
							otas.splice(index, 1);
							console.log(otas.length);
						}
					}
				});
				
				if (otas.length <= OTA_MAX) {
					game.rootScene.addChild(ota);
					otas.push(ota);
				}
			}
		});
    };
    game.start();
};
