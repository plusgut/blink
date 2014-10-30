var Blink1  = require('node-blink1');
var express = require('express');
var blink1  = new Blink1();
var app     = express();

var blinker = {
	values: [],
	current: -1,
	length: 800,
	def: 'black', // Default value
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
	writeColor: function() {
		this.current = this.increment(this.current, this.values.length);
		var color =  this.getColor(this.def);
		if(this.current !== -1) {
			color = this.values[this.current];
		}
		console.log(color);
		blink1.fadeToRGB(this.length, color[0], color[1], color[2]);
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
			if(length === 0 || length === 1) {
				value = -1;
			} else {
				value = 0;
			}
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
runloop.addJob({callback: blinker.writeColor.bind(blinker)});

// small API
app.get('/removeColor/:code', function (req, res, next) {
	var colorCode = blinker.getColor(req.params.code);
	blinker.remove(colorCode);
	res.end(JSON.stringify(blinker.values));
});

app.get('/remove/:r/:g/:b', function (req, res, next) {
	var colorCode = blinker.getColorcode([req.params.r, req.params.g, req.params.b]);
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
	var colorCode = blinker.getColorcode([req.params.r, req.params.g, req.params.b]);
	blinker.add(colorCode);
	res.end(JSON.stringify(blinker.values));
});

app.get('/get/', function (req, res, next) {
	res.end(JSON.stringify(blinker.values));
});

app.listen(8080);
