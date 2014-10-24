var Blink1 = require('node-blink1');
var blink1 = new Blink1();

var blinker = {
	def: 'white',
	values: [],
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
		var self = this;
		blink1.rgb(0, function(r, g, b) {
			var found = false;
			var color = null;
			for(var i = 0; i < self.values.length; i++) {
				var colorCode = self.values[i];
				if(r == colorCode[0] && g == colorCode[1] && b == colorCode[2]) {
					if(self.values.length === 1) {
						color = self.getColor('white');
					} else {
						var next = self.increment(i, self.values.length);
						color = self.values[next];
					}
				}
			}
			if(!color) {
				if(self.values.length === 0) {
					color = self.getColor('white');
				} else {
					color = self.values[0];
				}
			}

			blink1.fadeToRGB(self.length, color[0], color[1], color[2], blinker.hold.bind(blinker));
		});
	},
	hold: function() {
		setTimeout(blinker.writePattern.bind(blinker), this.length);
	},
	increment: function(value, length) {
		value++;
		if(value >= length) {
			value = 0;
		}
		return value;
	}
};

var values = ['red', 'blue', 'white', 'green'];

for(var i = 0; i < values.length; i++) {
	blinker.values.push(blinker.getColor(values[i]));
}

blinker.writePattern();