var Blink1 = require('node-blink1');
var blink1 = new Blink1();

var blinker = {
	colors: {black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 255, 0], blue: [0, 0, 255]},
	getColor: function(color) {
		if(this.colors[color]) {
			return this.colors[color];
		} else {
			console.log('Color ' + color + ' not found');
			return this.colors.black;
		}
	},
	writePattern: function(length, color, cb) {
		var colorCode = this.getColor(color);
		blink1.writePatternLine(length, colorCode[0], colorCode[1], colorCode[2], 0);
		// colorCode = this.getColor('white');
		blink1.writePatternLine(length, colorCode[0], colorCode[1], colorCode[2], 1);
		blink1.play(0, cb);
	}
};

blinker.writePattern(200, 'green', function() {
	blink1.pause();
});