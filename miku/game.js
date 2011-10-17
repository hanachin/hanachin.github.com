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
    game.preload('font.png', 'miku.png');
    game.onload = function() {
    };
    game.start();
	window['game'] = enchant.Game.instance;
};
