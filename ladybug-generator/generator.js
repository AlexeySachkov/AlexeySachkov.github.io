Vue.config.debug = true;

function random(min, max) {
	return Math.random() * (max - min) + min;
}

function gradToRad(grad) {
	return grad * Math.PI / 180;
}

function _d(c) {
	if (c.length == 1) {
		return c + c;
	} else {
		return c;
	}
}

function _c(c) {
	if (c.length == 1) {
		var t = parseInt(random(0, 4)).toString(16);
		return t + c;
	} else {
		return c;
	}
}

function _color(r, g, b) {
	return '#' + r + g + b;
}

function color(r, g, b) {
	return "#" + _d(r.toString(16)) + _d(g.toString(16)) + _d(b.toString(16));
}

function randomColor() {
	return color(parseInt(random(0, 255)), parseInt(random(0, 255)), parseInt(random(0, 255)));
}

function randomRed() {
	return color(parseInt(random(119, 255)), 0, 0); // 77 in hex
}

function randomBlack() {
	var black = parseInt(random(0, 68)); // 44 in hex
	return _color(_c(black), _c(black), _c(black));
}

console.debug('generator.js');
var vm = new Vue({
	el: '#ladybug-generator-app',
	data: {
		variables: {
			X: 0,
			Y: 0,
			body: {
				square: 0,
				size: 0,
				color: '',
				border: {
					width: 0,
					color: ''
				},
				stripe: {
					width: 0,
					color: ''
				},
				X: 0,
				Y: 0
			},
			head: {
				square: 0,
				size: 0,
				color: '',
				border: {
					width: 0,
					color: ''
				},
				X: 0,
				Y: 0
			},
			spots: [] // { X, Y, size, color }
		},
		canvas: {
			element: document.getElementById('canvas'),
			context: null,
			width: 0,
			height: 0
		},
		window: {
			width: 0,
			height: 0
		}
	},
	ready: function () {
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0];
	    this.window.width = w.innerWidth || e.clientWidth || g.clientWidth,
	    this.window.height = w.innerHeight|| e.clientHeight|| g.clientHeight;

	    this.canvas.context = this.canvas.element.getContext('2d');
	    this.canvas.width = this.canvas.element.width = this.canvas.element.parentNode.offsetWidth;
	    this.canvas.height = this.canvas.element.height = this.window.height - this.canvas.element.parentNode.offsetHeight;

	    this.generate();
	},
	methods: {
		generate: function () {
			this.canvas.context.fillStyle = 'lightblue';
			this.canvas.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.randomizeVariables();
			this.draw();
		},
		randomizeVariables: function () {
			var mn = Math.min(this.canvas.width, this.canvas.height);
			var mx = Math.max(this.canvas.width, this.canvas.height);

			this.variables.body.size = random(mn * 0.3, mn * 0.6) / 2;
			this.variables.body.square = parseInt(random(0, 2));
			this.variables.body.color = randomRed();

			this.variables.body.border.width = random(1, 0.2 * this.variables.body.size);
			this.variables.body.border.color = randomBlack();

			this.variables.body.stripe.width = random(1, 0.1 * this.variables.body.size);
			this.variables.body.stripe.color = this.variables.body.border.color;

			this.variables.head.size = random(this.variables.body.size * 0.4, this.variables.body.size * 0.7);
			this.variables.head.square = parseInt(random(0, 2));
			this.variables.head.color = randomBlack();

			this.variables.head.border.width = random(0, 0.2 * this.variables.head.size);
			this.variables.head.border.color = randomBlack();

			var totalHeight = this.variables.body.size * 2 + this.variables.head.size + this.variables.body.border.width + this.variables.head.border.width;

			this.variables.X = this.canvas.width / 2;
			this.variables.Y = this.canvas.height / 2 + (totalHeight / 2 - this.variables.body.size);
			console.debug(totalHeight, this.canvas.height, this.variables.Y);

			if (this.variables.body.square == 0) {
				this.variables.body.X = this.variables.X - this.variables.body.size;
				this.variables.body.Y = this.variables.Y - this.variables.body.size;
			} else {
				this.variables.body.X = this.variables.X;
				this.variables.body.Y = this.variables.Y;
			}

			if (this.variables.head.square == 0) {
				this.variables.head.X = this.variables.X - this.variables.head.size;
				this.variables.head.Y = this.variables.Y - this.variables.body.size - this.variables.head.size;
			} else {
				this.variables.head.X = this.variables.X;
				this.variables.head.Y = this.variables.Y - this.variables.body.size;
			}
		},
		draw: function () {
			var i;

			if (this.variables.head.square == 0) {
				this.canvas.context.beginPath();
				this.canvas.context.rect(this.variables.head.X, this.variables.head.Y, this.variables.head.size * 2, this.variables.head.size * 2);
				this.canvas.context.fillStyle = this.variables.head.color;
				this.canvas.context.lineWidth = this.variables.head.border.width;
				this.canvas.context.strokeStyle = this.variables.head.border.color;
				this.canvas.context.fill();
				this.canvas.context.stroke();
			} else {
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.variables.head.X, this.variables.head.Y, this.variables.head.size, 0, 2 * Math.PI, false);
				this.canvas.context.fillStyle = this.variables.head.color;
				this.canvas.context.fill();
				this.canvas.context.lineWidth = this.variables.head.border.width;
				this.canvas.context.strokeStyle = this.variables.head.border.color;
				this.canvas.context.stroke();
			}

			if (this.variables.body.square == 0) {
				this.canvas.context.beginPath();
				this.canvas.context.rect(this.variables.body.X, this.variables.body.Y, this.variables.body.size * 2, this.variables.body.size * 2);
				this.canvas.context.fillStyle = this.variables.body.color;
				this.canvas.context.lineWidth = this.variables.body.border.width;
				this.canvas.context.strokeStyle = this.variables.body.border.color;
				this.canvas.context.fill();
				this.canvas.context.stroke();

				this.canvas.context.beginPath();
				this.canvas.context.lineWidth = this.variables.body.stripe.width;
				this.canvas.context.strokeStyle = this.variables.body.stripe.color;
				this.canvas.context.moveTo(this.variables.X, this.variables.body.Y);
				this.canvas.context.lineTo(this.variables.X, this.variables.body.Y + this.variables.body.size * 2);
				this.canvas.context.stroke();
			} else {
				this.canvas.context.beginPath();
				this.canvas.context.arc(this.variables.body.X, this.variables.body.Y, this.variables.body.size, 0, 2 * Math.PI, false);
				this.canvas.context.fillStyle = this.variables.body.color;
				this.canvas.context.fill();
				this.canvas.context.lineWidth = this.variables.body.border.width;
				this.canvas.context.strokeStyle = this.variables.body.border.color;
				this.canvas.context.stroke();

				this.canvas.context.beginPath();
				this.canvas.context.lineWidth = this.variables.body.stripe.width;
				this.canvas.context.strokeStyle = this.variables.body.stripe.color;
				this.canvas.context.moveTo(this.variables.body.X, this.variables.body.Y - this.variables.body.size);
				this.canvas.context.lineTo(this.variables.body.X, this.variables.body.Y + this.variables.body.size);
				this.canvas.context.stroke();
			}

			
		}
	}
});