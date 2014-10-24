var Blink1 = require('node-blink1');
var blink1 = new Blink1();

var blinker = {
	color: 'white',
	toggleValue: 'white',
	length: 800,
	colors: {black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 255, 0], blue: [0, 0, 255]},
	getColor: function(color) {
		if(this.colors[color]) {
			return this.colors[color];
		} else {
			console.log('Color ' + color + ' not found');
			return this.colors.black;
		}
	},
	writePattern: function() {
		var toggleValue = this.getColor(this.toggleValue);
		var self = this;
		blink1.rgb(0, function(r, g, b) {
			var colorCode = self.getColor(self.color);
			if(r == colorCode[0] && g == colorCode[1] && b == colorCode[2]) {
				colorCode = self.getColor(self.toggleValue);
			}

			blink1.fadeToRGB(self.length, colorCode[0], colorCode[1], colorCode[2], blinker.writePattern.bind(blinker));
		});
	}
};

blinker.color = 'blue';
blinker.color = 'red';

blinker.writePattern();