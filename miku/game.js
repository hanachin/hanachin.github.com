Array.prototype.shuffle = function() {
    var i = this.length;
    while(i){
        var j = Math.floor(Math.random()*i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

enchant();

count = 0;

window.onload = function() {
	function radFromMiku(e) {
		return Math.atan2(game.height / 2 - e.y, e.x - game.width / 2);
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
	
    game = new Game(320, 320);
    game.fps = 24;
    game.preload('font.png', 'miku.png', 'onpu.gif');
    game.onload = function() {
		var miku = new Sprite(20, 28);
		miku.x = (game.width - miku.width) / 2;
		miku.y = (game.height - miku.height) / 2;
		miku.image = game.assets['miku.png'];
		miku.frame = 1;
		miku.addEventListener('enterframe', function (e) {
			miku.frame = Math.floor(game.frame / 2) % 3;
		});
		
		game.rootScene.addEventListener('touchstart', function (e) {
			var rad = radFromMiku(e);
			var deg = degFromMiku(e);
			
			miku.rotation = deg;
			
			var onpu = new Sprite(18, 17);
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
				if (onpu.x < 0 || game.width < onpu.x || onpu.y < 0 || game.height < onpu.y) {
					game.rootScene.removeChild(onpu);
				}
			});
			
			game.rootScene.addChild(onpu);
		});
		
		game.rootScene.addEventListener('touchmove', function (e) {
			var deg = degFromMiku(e);
			miku.rotation = deg;
		});
		
		game.rootScene.addChild(miku);
    };
    game.start();
};
