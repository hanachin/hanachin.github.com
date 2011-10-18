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
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('font.png', 'chara1.gif');
    game.onload = function() {
    	function numBlock(n) {
    		var block = new Group();
    		block.x = 0;
    		block.y = 0;
    		var nums = (""+n).split('').map(function (x) { return parseInt(x); });
    		for (var i = 0; i < nums.length; i++) {
    			var sp = numSprite(nums[i]);
    			sp.x = i * 16;
    			sp.y = 16;
    			block.addChild(sp);
    		}
    		return block;
    	}
    	function numSprite(n) {
    		var sp = new Sprite(16, 16);
    		sp.image = game.assets['font.png'];
    		sp.x = 0;
    		sp.y = 0;
    		sp.frame = n + 16;
    		return sp;
    	}
    	function init() {
    		var scene = game.currentScene;
    		
    		var bear = new Sprite(32, 32);
    		var bomb_flag = false;
    		var bomb_count = 0;
    		bear.image = game.assets['chara1.gif'];
    		bear.x = 0;
    		bear.y = 0;
    		bear.addEventListener('enterframe', function () {
    			if (bomb_flag) {
    				bear.frame = 3;
    				if (++bomb_count % 8 == 0) { bomb_flag = false; }
    			} else {
    				bear.frame = Math.floor(game.frame / 2) % 3;
    			}
    		});
    		scene.addChild(bear);
    		
    		var text= new MutableText(32, 32, 320, 320);
    		text.text = 'bom!';
    		text.addEventListener('touchstart', function () {
    			text.text = 'booooom!';
    			bomb_flag = true;
    			
    			var bomb = new ExSprite(16, 16);
        		bomb.x = 0;
        		bomb.y = 0;
        		bomb.blast(6);
        		scene.addChild(bomb);
    		});
    		scene.addChild(text);
    	}
    	init();
    };
    game.start();
	window['game'] = enchant.Game.instance;
};
