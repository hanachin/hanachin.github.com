enchant.hanachin = { assets: [] };

enchant.hanachin.KyunSprite = enchant.Class.create(enchant.util.ExSprite, {
	initialize: function(width, height) {
		ExSprite.call(this, arguments[0], arguments[1]);
	},
	blast: function(frame) {
		if(this._mode == 'normal'){
			this._mode = 'blast';
			this.scale(this.width/17);
			this.image = game.assets['effect0.gif'];
			this.width = 17;
			this.height = 16;
			this.frame = 16;
			this._blastf = 0;
			this._blast = (1/frame) || (1/10);
		}
	},
});
