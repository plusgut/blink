var Blink1  = require('node-blink1');
var express = require('express');
var blink1  = new Blink1();
var app     = express();

var blinker = {
	values: [],
	length: 800,
	// Just some colors i could think of
	colors: {black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 255, 0], blue: [0, 0, 255]},
	getColor: function(color) {
		if(this.colors[color]) {
			return this.colors[color];
		} else {
			console.log('Color ' + color + ' not found');
			return this.colors.black;
		}
	},
	getColorcode: function(values) {
		var result = [];
		for (var i = 0; i < values.length; i++) {
			result.push(parseInt(values[i]));
		}

		return result;
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
						color = self.getColor('white'); // When a color is alone, white should be toggling
					} else {
						var next = self.increment(i, self.values.length);
						color = self.values[next];
					}
				}
			}
			if(self.values.length === 0) {
				color = self.getColor('black'); // When no tasks are inside, disable it
			} else if(!color) {
				color = self.values[0]; // When the color was not found, it either was removed or white was used for toggling
			}
			color = self.getColorcode(color);
			console.log(color);
			blink1.fadeToRGB(self.length, color[0], color[1], color[2]);
		});
	},
	add: function(colorCode) {
		this.values.push(colorCode);
	},
	remove: function(colorCode) {
		var result = [];
		for(var i = 0; i < this.values.length; i++) {
			var value = this.values[i];
			if(!(colorCode[0] == value[0] && colorCode[1] == value[1] && colorCode[2] == value[2])) {
				result.push(value);
			}
		}
		this.values = result;
	},
	increment: function(value, length) {
		value++;
		if(value >= length) {
			value = 0;
		}
		return value;
	}
};

var runloop = {
	jobs: [],
	ticks: 1500,
	init: function() {
		this.loop();
	},
	loop: function() {
		for(var i = 0; i < this.jobs.length; i++) {
			if(true) {
				this.jobs[i].callback();
			} else {
				try {
					this.jobs[i].callback();
				} catch(err) {
					console.log(this.jobs[i], err);
				}
			}
		}
		setTimeout(this.loop.bind(this), this.ticks);
	},
	addJob: function(job) {
		this.jobs.push(job);
	}
};

runloop.init();
runloop.addJob({callback: blinker.writePattern.bind(blinker)});

// small API
app.get('/removeColor/:code', function (req, res, next) {
	var colorCode = blinker.getColor(req.params.code);
	blinker.remove(colorCode);
	res.end(JSON.stringify(blinker.values));
});

app.get('/remove/:r/:g/:b', function (req, res, next) {
	var colorCode = [req.params.r, req.params.g, req.params.b];
	blinker.remove(colorCode);
	res.end(JSON.stringify(blinker.values));
});

app.get('/addColor/:code', function (req, res, next) {
	var colorCode = blinker.getColor(req.params.code);
	if(colorCode) {
		blinker.add(colorCode);
	}
	res.end(JSON.stringify(blinker.values));
});

app.get('/add/:r/:g/:b', function (req, res, next) {
	var colorCode = [req.params.r, req.params.g, req.params.b];
	console.log(colorCode);
	blinker.add(colorCode);
	res.end(JSON.stringify(blinker.values));
});

app.get('/get/', function (req, res, next) {
	res.end(JSON.stringify(blinker.values));
});

app.listen(8080);
