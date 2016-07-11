Vue.config.debug = true;

function random(min, max) {
	return Math.random() * (max - min) + min;
}

console.debug('generator.js');
var vm = new Vue({
	el: '#bumblebee-generator-app',
	data: {
		variables: {
			widht: 0,
			height: 0,
			X: 0,
			Y: 0,
			border: 0,
			face: 0,
			back: 0,
			stripes: {
				count: 0,
				width: 0
			},
			eyes: {
				padding: 0,
				innerSize: 0,
				outerSize: 0,
				Y: 0
			},
			mouth: {
				width: 0,
				height: 0,
				X: 0,
				Y: 0
			},
			wings: {
				width: 0,
				height: 0,
				X: 0,
				Y: 0,
				stripes: {
					width: 0,
					height: 0,
					X: 0,
					Y: 0
				}
			},
			legs: {
				width: 0,
				height: 0,
				padding: 0
			}
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
		console.debug('ready');
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0];
	    this.window.width = w.innerWidth || e.clientWidth || g.clientWidth,
	    this.window.height = w.innerHeight|| e.clientHeight|| g.clientHeight;

	    this.canvas.context = this.canvas.element.getContext('2d');
	    this.canvas.width = this.canvas.element.width = this.canvas.element.parentNode.offsetWidth;
	    this.canvas.height = this.canvas.element.height = this.window.height - this.canvas.element.parentNode.offsetHeight;
	    console.debug(this.canvas);

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
			console.debug('randomizeVariables');
			this.variables.width = random(this.canvas.width / 10, this.canvas.width / 2);
			this.variables.height = random(this.canvas.height / 8, this.canvas.height / 3);

			this.variables.X = this.canvas.width / 2 - 0.5 * this.variables.width;
			this.variables.Y = this.canvas.height / 2 - 0.75 * this.variables.height;

			this.variables.border = random(0, 1);

			this.variables.face = random(Math.max(Math.floor(this.variables.width / 10), 3 * 5 + 2 * 10), Math.floor(this.variables.width / 3));
			this.variables.back = random(Math.floor(this.variables.width / 10), Math.floor(this.variables.width / 3));

			this.variables.stripes.count = random(2, (this.variables.width - this.variables.face - this.variables.back) / 10);
			this.variables.stripes.width = (this.variables.width - this.variables.face - this.variables.back) / this.variables.stripes.count;

			this.variables.eyes.padding = random(5, Math.max((this.variables.face - 2 * 10) / 3, 5));
			this.variables.eyes.outerSize = random(10, Math.max((this.variables.face - 3 * this.variables.eyes.padding) / 2, 10));
			this.variables.eyes.innerSize = random(5, this.variables.eyes.outerSize / 2);
			this.variables.eyes.Y = random(this.variables.Y, this.variables.Y + this.variables.height * 0.7);

			this.variables.mouth.X = random(this.variables.X, this.variables.X + 20);
			this.variables.mouth.width = random(10, this.variables.X + this.variables.face - this.variables.mouth.X);
			this.variables.mouth.height = random(3, 15);
			this.variables.mouth.Y = random(this.variables.eyes.Y + this.variables.eyes.outerSize + 5, this.variables.Y + this.variables.height - this.variables.mouth.height - 5);
		
			this.variables.wings.X = Math.min(random(this.variables.X + this.variables.face, this.variables.X + this.variables.width - this.variables.back), this.variables.X + this.variables.width / 2);
			this.variables.wings.width = random(Math.max(this.variables.face, this.variables.back), this.variables.width);
			this.variables.wings.height = random(this.variables.height / 7, this.variables.height / 2);
			this.variables.wings.Y = this.variables.Y - this.variables.wings.height;

			this.variables.wings.stripes.width = random(20, this.variables.wings.width - 10);
			this.variables.wings.stripes.height = random(20, this.variables.wings.height - 10);
			this.variables.wings.stripes.X = random(this.variables.wings.X + 10, this.variables.wings.X + this.variables.wings.width - this.variables.wings.stripes.width - 10);
			this.variables.wings.stripes.Y = random(this.variables.wings.Y + 10, this.variables.wings.Y + this.variables.wings.height - this.variables.wings.stripes.height - 10);
		
			this.variables.legs.width = random(3, 10);
			this.variables.legs.height = random(10, this.variables.height / 4);
			this.variables.legs.padding = (this.variables.width - this.variables.face - this.variables.back - 6 * this.variables.legs.width) / 6;
		},
		draw: function () {
			console.debug('draw');
			var i;

			this.canvas.context.fillStyle = "#000";
			this.canvas.context.fillRect(this.variables.X, this.variables.Y, this.variables.width, this.variables.height);

			this.canvas.context.fillStyle = "#eee";
			this.canvas.context.fillRect(this.variables.X + this.variables.width - this.variables.back, this.variables.Y, this.variables.back, this.variables.height);

			this.canvas.context.fillStyle = "#111";
			this.canvas.context.fillRect(this.variables.X, this.variables.Y, this.variables.face, this.variables.height);

			this.canvas.context.fillStyle = "yellow";
			for (i = 0; i < this.variables.stripes.count; i += 2) {
				this.canvas.context.fillRect(this.variables.X + this.variables.face + i * this.variables.stripes.width, this.variables.Y, this.variables.stripes.width, this.variables.height);
			}

			this.canvas.context.fillStyle = "blue";
			this.canvas.context.fillRect(this.variables.X + this.variables.eyes.padding, this.variables.eyes.Y, this.variables.eyes.outerSize, this.variables.eyes.outerSize);
			this.canvas.context.fillRect(this.variables.X + 2 * this.variables.eyes.padding + this.variables.eyes.outerSize, this.variables.eyes.Y, this.variables.eyes.outerSize, this.variables.eyes.outerSize);

			this.canvas.context.fillStyle = "#fff";
			this.canvas.context.fillRect(this.variables.X + this.variables.eyes.padding + this.variables.eyes.outerSize / 4, this.variables.eyes.Y + this.variables.eyes.outerSize / 4, this.variables.eyes.innerSize, this.variables.eyes.innerSize);
			this.canvas.context.fillRect(this.variables.X + 2 * this.variables.eyes.padding + this.variables.eyes.outerSize / 4 + this.variables.eyes.outerSize, this.variables.eyes.Y + this.variables.eyes.outerSize / 4, this.variables.eyes.innerSize, this.variables.eyes.innerSize);

			this.canvas.context.fillStyle = "#fff";
			this.canvas.context.fillRect(this.variables.mouth.X, this.variables.mouth.Y, this.variables.mouth.width, this.variables.mouth.height);

			this.canvas.context.fillStyle = "#fff";
			this.canvas.context.fillRect(this.variables.wings.X, this.variables.wings.Y, this.variables.wings.width, this.variables.wings.height);

			this.canvas.context.fillStyle = "lightblue";
			this.canvas.context.fillRect(this.variables.wings.stripes.X, this.variables.wings.stripes.Y + this.variables.wings.stripes.height / 3, this.variables.wings.stripes.width, 3);
			this.canvas.context.fillRect(this.variables.wings.stripes.X, this.variables.wings.stripes.Y + 2 * this.variables.wings.stripes.height / 3, this.variables.wings.stripes.width, 3);
			this.canvas.context.fillRect(this.variables.wings.stripes.X + this.variables.wings.stripes.width / 3, this.variables.wings.stripes.Y, 3, this.variables.wings.stripes.height);
			this.canvas.context.fillRect(this.variables.wings.stripes.X + 2 * this.variables.wings.stripes.width / 3, this.variables.wings.stripes.Y, 3, this.variables.wings.stripes.height);

			this.canvas.context.fillStyle = "#000";
			for (i = 1; i <= 6; ++i) {
				this.canvas.context.fillRect(this.variables.X + this.variables.face + i * this.variables.legs.padding, this.variables.height + this.variables.Y, this.variables.legs.width, this.variables.legs.height);
			}
		}
	}
});