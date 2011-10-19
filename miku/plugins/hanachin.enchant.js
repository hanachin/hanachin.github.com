enchant.hanachin = { assets: ['combo.png'] };

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

enchant.hanachin.ComboText = enchant.Class.create(enchant.util.MutableText, {
	initialize: function(posX, posY, width, height) {
		enchant.util.ExSprite.call(this, 0, 0);
		var game = enchant.Game.instance;
		var width = (arguments[2] || game.width);
		var height = (arguments[3] || game.height);
		this.fontHeight = 18;
		this.fontWidth = 10;
		this.fontSize = 10;
		this.widthItemNum = 13;
		// font.png ÇÃâ°ÇÃï∂éöêî
		this.returnLength = width/this.fontWidth;
		// â¸çsÇì¸ÇÍÇÈï∂éöêî
		this.image = new Surface(width, height);
		this.x = posX;
		this.y = posY;
		this.text = '';
	},
	setText: function(txt) {
		var i, x, y, wNum, charCode, charPos;
		var game = enchant.Game.instance;
		this._text = txt;
		this.width = this.returnLength * this.widthItemNum;
		this.height = this.fontHeight * (((this._text.length / this.returnLength)|0)+1);
		this.image.context.clearRect(0, 0, this.width, this.height);
		for(i=0; i<txt.length; i++) {
			charCode = txt.charCodeAt(i);
			if (charCode >= 32 && charCode <= 127) {
				charPos = charCode - 48;
			} else {
				charPos = 0;
			}
			x = charPos % this.widthItemNum;
			y = (charPos / this.widthItemNum)|0;
			console.log(charPos);
			console.log([game.assets['combo.png'], 
				x * this.fontWidth, y * this.fontHeight, this.fontWidth, this.fontHeight,
				(i%this.returnLength)*this.fontWidth, ((i/this.returnLength)|0)*this.fontHeight, this.fontWidth, this.fontHeight]);
			this.image.draw(game.assets['combo.png'], 
				x * this.fontWidth, y * this.fontHeight, this.fontWidth, this.fontHeight,
				(i%this.returnLength)*this.fontWidth, ((i/this.returnLength)|0)*this.fontHeight, this.fontWidth, this.fontHeight);
		}
	},
	text: {
		get: function() {
			return this._text;
		},
		set: function(txt) {
			this.setText(txt);
		}
	},
	row: {
		get: function() {
			return this.returnLength;
		},
		set: function(row) {
			this.returnLength = row;
			this.text = this.text;
		}
	}
});
