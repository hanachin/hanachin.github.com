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
    game = new Game(320, 320);
    game.fps = 24;
    game.preload('font.png', 'miku.png');
    game.onload = function() {
		var miku = new Sprite(20, 28);
		miku.x = (game.width - miku.width) / 2;
		miku.y = (game.height - miku.height) / 2;
		miku.image = game.assets['miku.png'];
		miku.frame = 1;
		game.rootScene.addChild(miku);
    };
    game.start();
};
