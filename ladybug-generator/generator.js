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

function distance(x1, y1, x2, y2) {
	return Math.sqrt( (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) );
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
			legs: {
				width: 0,
				color: '',
				X: 0,
				Y: 0,
				data: [] // { angle, len }
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

			var k = random(0.2 * this.variables.body.size, 0.35 * this.variables.body.size);
			var l = k + this.variables.body.size + this.variables.body.border.width;
			var ll = k + this.variables.body.size * 1.4 + this.variables.body.border.width;
			this.variables.legs.width = random(1, 0.2 * this.variables.body.size);
			this.variables.legs.color = randomBlack();	
			this.variables.legs.X = this.variables.X;
			this.variables.legs.Y = this.variables.Y;
			this.variables.legs.data = [];

			this.variables.legs.data.push({ angle: 0, len: l });
			this.variables.legs.data.push({ angle: -40, len: this.variables.body.square != 0 ? l : ll });
			this.variables.legs.data.push({ angle: 40, len: this.variables.body.square != 0 ? l : ll });
			this.variables.legs.data.push({ angle: 140, len: this.variables.body.square != 0 ? l : ll });
			this.variables.legs.data.push({ angle: 180, len: l });
			this.variables.legs.data.push({ angle: 220, len: this.variables.body.square != 0 ? l : ll });

			var i;
			for (i = 0; i < this.variables.legs.data.length; ++i) {
				this.variables.legs.data[i].angle += random(-7, 7);
			}

			var n = parseInt(random(10, this.variables.body.square != 0 ? 200 : 20));
			this.variables.spots = [];

			while (n > 0) {
				var x, y, si, s, f;

				si = random(0.05 * this.variables.body.size, 0.35 * this.variables.body.size);
				s = parseInt(random(0, 2)) == 0;
				if (this.variables.body.square == 0) {
					x = random(si, this.variables.body.size - si);
					y = random(si, 2 * this.variables.body.size - si);
					f = true;
				} else {
					x = random(si, this.variables.body.size - si);
					var t = Math.sqrt( this.variables.body.size * this.variables.body.size - x * x );
					y = random(t, 2 * (this.variables.body.size - t) + t);

					if (distance(x, y, this.variables.body.size, this.variables.body.size) >= this.variables.body.size + si) {
						f = false;
					} else {
						f = true;
					}
				}

				if (f) {
					for (i = 0; i < this.variables.spots.length; ++i) {
						if (s == this.variables.spots[i].side && distance(x, y, this.variables.spots[i].X, this.variables.spots[i].Y) <= si + this.variables.spots[i].size) {
							f = false;
							break;
						}
					}
				}

				if (f) {
					this.variables.spots.push({
						X: x,
						Y: y,
						size: si,
						side: s,
						color: randomBlack()
					});
				}

				--n;
			}
		},
		draw: function () {
			var i;

			this.canvas.context.beginPath();
			this.canvas.context.lineWidth = this.variables.legs.width;
			this.canvas.context.strokeStyle = this.variables.legs.color;
			var i;
			for (i = 0; i < this.variables.legs.data.length; ++i) {
				this.canvas.context.moveTo(this.variables.legs.X, this.variables.legs.Y);
				this.canvas.context.lineTo(this.variables.legs.X + this.variables.legs.data[i].len * Math.cos(gradToRad(this.variables.legs.data[i].angle)), this.variables.legs.Y + this.variables.legs.data[i].len * Math.sin(gradToRad(this.variables.legs.data[i].angle)));
			}
			this.canvas.context.stroke();

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

				for (i = 0; i < this.variables.spots.length; ++i) {
					this.canvas.context.beginPath();
					this.canvas.context.fillStyle = this.variables.spots[i].color;
					if (this.variables.spots[i].side == 0) {
						this.canvas.context.arc(this.variables.spots[i].X + this.variables.body.X, this.variables.spots[i].Y + this.variables.body.Y, this.variables.spots[i].size, 0, 2 * Math.PI, false);
					} else {
						this.canvas.context.arc(this.variables.spots[i].X + this.variables.body.X + this.variables.body.size, this.variables.spots[i].Y + this.variables.body.Y, this.variables.spots[i].size, 0, 2 * Math.PI, false);
					}

					this.canvas.context.fill();
				}

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

				for (i = 0; i < this.variables.spots.length; ++i) {
					this.canvas.context.beginPath();
					this.canvas.context.fillStyle = this.variables.spots[i].color;
					if (this.variables.spots[i].side == 0) {
						this.canvas.context.arc(this.variables.spots[i].X + this.variables.body.X - this.variables.body.size, this.variables.spots[i].Y + this.variables.body.Y - this.variables.body.size, this.variables.spots[i].size, 0, 2 * Math.PI, false);
					} else {
						this.canvas.context.arc(this.variables.spots[i].X + this.variables.body.X, this.variables.spots[i].Y + this.variables.body.Y - this.variables.body.size, this.variables.spots[i].size, 0, 2 * Math.PI, false);
					}
					this.canvas.context.fill();
				}

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