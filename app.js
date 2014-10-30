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
			var value = this.values[this.current];
			color = value.color;
			value.times++;
		}
		console.log(color);
		blink1.fadeToRGB(this.length, color[0], color[1], color[2]);
		this.cleanup();
	},
	cleanup: function() {
		var result = [];
		for(var i = 0; i < this.values.length; i++) {
			var value = this.values[i];
			if(!value.max || value.max > value.times) {
				result.push(value);
			}
		}
		this.values = result;
	},
	add: function(colorCode, times) {
		if(times || !this.exists(colorCode)) {
			this.values.push({color: colorCode, max: times, times: 0});
		}
	},
	exists: function(colorCode) {
		for(var i = 0; i < this.values.length; i++) {
			var value = this.values[i];
			if(this.isSame(value.color, colorCode)) {
				return true;
			}
		}
	},
	remove: function(colorCode) {
		var result = [];
		for(var i = 0; i < this.values.length; i++) {
			var value = this.values[i];
			if(!this.isSame(value.color, colorCode)) {
				result.push(value);
			}
		}
		this.values = result;
	},
	isSame: function(value, colorCode) {
		if(colorCode[0] == value[0] && colorCode[1] == value[1] && colorCode[2] == value[2]) {
			return true;
		}
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

var api = {
	removeColor: function (req, res, next) {
		var colorCode = blinker.getColor(req.params.code);
		blinker.remove(colorCode);
		res.end(JSON.stringify(blinker.values));
	},
	remove: function (req, res, next) {
		var colorCode = blinker.getColorcode([req.params.r, req.params.g, req.params.b]);
		blinker.remove(colorCode);
		res.end(JSON.stringify(blinker.values));
	},
	addColor: function (req, res, next) {
		var colorCode = blinker.getColor(req.params.code);
		if(colorCode) {
			blinker.add(colorCode, req.params.max);
		}
		res.end(JSON.stringify(blinker.values));
	},
	add: function (req, res, next) {
		var colorCode = blinker.getColorcode([req.params.r, req.params.g, req.params.b]);
		blinker.add(colorCode, req.params.max);
		res.end(JSON.stringify(blinker.values));
	},
	get: function (req, res, next) {
		res.end(JSON.stringify(blinker.values));
	}
};
// small API
app.get('/removeColor/:code', api.removeColor);
app.get('/remove/:r/:g/:b', api.remove);
app.get('/addColor/:code', api.addColor);
app.get('/addColor/:code/:max', api.addColor);
app.get('/add/:r/:g/:b', api.add);
app.get('/add/:r/:g/:b/:max', api.add);
app.get('/get/', api.get);

app.listen(8080);
