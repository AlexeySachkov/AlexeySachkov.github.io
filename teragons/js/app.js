var canvas = document.getElementById('canvas');
var iterations_count_input = document.getElementById('iterations_count_input');
var base_type_selectbox = document.getElementById('base_type_selectbox');
var template_type_selectbox = document.getElementById('template_type_selectbox');
var vertical_invert_checkbox = document.getElementById('vertical_invert_checkbox');
var vertical_invert_by_iteration_selecbox = document.getElementById('vertical_invert_by_iteration_selecbox');
var vertical_invert_by_segment_selecbox = document.getElementById('vertical_invert_by_segment_selecbox');
var source_data_input = document.getElementById('source_data_input');
var result_data_input = document.getElementById('result_data_input');
var help_block_span = document.getElementById('help_block_span');
var redraw_button = document.getElementById('redraw');
var generate_button = document.getElementById('generate');

var context = canvas.getContext('2d');

canvas.style.width = '100%';
canvas.style.height = '100%';

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

help_block_span.innerHTML = 'Размеры области: ' + canvas.width + ' х ' + canvas.height + ' пикселей';

generate_button.addEventListener('click', function(event) {
	var intialization_type = base_type_selectbox.value;

	var data;

	if (intialization_type == 'segment') {
		var y = canvas.height / 3;
		data = [ vec3.fromValues(5 * canvas.width / 6, y, 1), vec3.fromValues(-4 * canvas.width / 6, 0, 0) ];
	} else if (intialization_type == '2segment') {
		var y = canvas.height / 2;
		data = [ vec3.fromValues(5 * canvas.width / 6, y, 1), vec3.fromValues(-4 * canvas.width / 6, 0, 0), vec3.fromValues(4 * canvas.width / 6, 0, 0) ];
	} else if (intialization_type == 'triangle') {
		var l = Math.min(canvas.width, canvas.height) / 3;
		data = generate_right_poly(canvas.width / 2, canvas.height / 2, l, 3, 0);
	} else if (intialization_type == 'square') {
		var l = Math.min(canvas.width, canvas.height) / 3;
		data = generate_right_poly(canvas.width / 2, canvas.height / 2, l, 4, 0);
	} else if (intialization_type == '5poly') {
		var l = Math.min(canvas.width, canvas.height) / 3;
		data = generate_right_poly(canvas.width / 2, canvas.height / 2, l, 5, 0);
	} else if (intialization_type == '6poly') {
		var l = Math.min(canvas.width, canvas.height) / 3;
		data = generate_right_poly(canvas.width / 2, canvas.height / 2, l, 6, 0);
	}

	source_data_input.value = JSON.stringify(data);
	event.stopPropagation();
});

redraw_button.addEventListener('click', function(event) {
	var _base = JSON.parse(source_data_input.value);
	var base = [];

	for (var i = 0; i < _base.length; ++i) {
		base.push(vec3.fromValues(_base[i][0], _base[i][1], _base[i][2]));
	}

	var iterations = parseInt(iterations_count_input.value);
	var vertical_invert = vertical_invert_checkbox.checked ? 1 : -1;
	var vertical_invert_by_iteration = parseInt(vertical_invert_by_iteration_selecbox.value);
	var vertical_invert_by_segment = parseInt(vertical_invert_by_segment_selecbox.value);
	var min_length = 1;

	var template = get_template(template_type_selectbox.value);

	var result = recalc(base, template, min_length, iterations, vertical_invert, vertical_invert_by_iteration, vertical_invert_by_segment);
	draw(base, result);
	event.stopPropagation();
});

function recalc(base, template, min_length, max_iterations, vertical_invert, vertical_invert_by_iteration, vertical_invert_by_segment) {
	var data = base;
	var iteration = 0;
	var segment = 0;

	for (iteration = 0; iteration < max_iterations; ++iteration) {
		var new_data = [];
		var f = false;
		var k = 0;

		for (var i = 0; i < data.length; ++i) {
			var element = data[i];
			if (is_point(element)) {
				new_data.push(element);
				continue;
			}
			++k;
			var r = vec3.length(element);
			var v = (vertical_invert_by_iteration == 0 ? 0 : 1) * (vertical_invert_by_iteration + iteration + 2) + (vertical_invert_by_segment == 0 ? 0 : 1) * (vertical_invert_by_segment + k + 1);
			var a = vector_angle(element);
			if (r > min_length) {
				f = true;

				for (var j = 0; j < template.length; ++j) {
					var n = vec3.clone(template[j]);
					n = scale(n, [r, r * vertical_invert * Math.pow(-1, v)]);
					n = rotate(n, a);
					new_data.push(n);
				}
			} else {
				new_data.push(element);
			}
		}

		data = new_data;
		if (!f) {
			break;
		}
	}

	result_data_input.value = JSON.stringify(data);
	return data;
}

function draw(original, result) {
	clear();

	context.setLineDash([10, 10]);
	context.strokeStyle = '#777';
	context.strokeWitdh = 2;
	var base = [];

	context.beginPath();
	for (i = 0; i < original.length; ++i) {
		var element = original[i];

		if (is_point(element)) {
			context.moveTo(element[0], make_real_y(element[1]));
			base = element;
		} else {
			var point = move(base, element);
			context.lineTo(point[0], make_real_y(point[1]));
			base = point;
		}
	}
	context.stroke();

	context.setLineDash([]);
	context.strokeStyle = 'darkred';
	context.strokeWitdh = 3;

	context.beginPath();
	for (i = 0; i < result.length; ++i) {
		var element = result[i];

		if (is_point(element)) {
			context.moveTo(element[0], make_real_y(element[1]));
			base = element;
		} else {
			var point = move(base, element);
			context.lineTo(point[0], make_real_y(point[1]));
			base = point;
		}
	}
	context.stroke();
}

function clear() {
	context.fillStyle = '#fff';
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function make_real_y(y) {
	return canvas.height - y;
}

function generate_right_poly(xc, yc, R, n, f0) {
	var t = [];
	for (var i = 0; i < n; ++i) {
		var x = xc + R * Math.cos(f0 + 2 * Math.PI * i / n);
		var y = yc + R * Math.sin(f0 + 2 * Math.PI * i / n);
		t.push([x, y]);
	}

	var data = [];

	var last = point(t[0][0], t[0][1]);
	data.push(last);
	for (var i = 1; i < n; ++i) {
		var p = point(t[i][0], t[i][1]);
		data.push(vector(last, p));
		last = p;
	}
	data.push(vector(last, data[0]));

	return data;
}

function get_template(name) {
	var data = [];

	if (name == 't1') {
		data  = [
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(1/6, 1/3, 0),
			vec3.fromValues(1/6, -1/3, 0),
			vec3.fromValues(1/3, 0, 0)
		];
	} else if (name == 't2') {
		data = [
			vec3.fromValues(1/3, -1/12, 0),
			vec3.fromValues(1/3, 2/12, 0),
			vec3.fromValues(1/3, -1/12, 0)
		];
	} else if (name == 't3') {
		data = [
			vec3.fromValues(4/10, -2/10, 0),
			vec3.fromValues(2/10, 4/10, 0),
			vec3.fromValues(4/10, -2/10, 0)
		];
	} else if (name == 't4') {
		data = [
			vec3.fromValues(1/2, -1/4, 0),
			vec3.fromValues(0, 2/4, 0),
			vec3.fromValues(1/2, -1/4, 0)
		];
	} else if (name == 't5') {
		data = [
			vec3.fromValues(1/2, 1/2, 0),
			vec3.fromValues(1/2, -1/2, 0)
		];
	} else if (name == 't6') {
		data = [
			vec3.fromValues(0, 1/2, 0),
			vec3.fromValues(1/2, 0, 0),
			vec3.fromValues(1/2, 0, 0),
			vec3.fromValues(0, -1/2, 0)
		];
	} else if (name == 't7') {
		data = [
			vec3.fromValues(1/2, 0, 0),
			vec3.fromValues(0, 1/2, 0),
			vec3.fromValues(0, -1/2, 0),
			vec3.fromValues(1/2, 0, 0)
		];
	} else if (name == 't8') {
		data = [
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(-1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0)
		];
	} else if (name == 't9') {
		data = [
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(-1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0)
		];
	} else if (name == 't10') {
		data = [
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(-1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0)
		];
	} else if (name == 't11') {
		data = [
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(-1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
		];
	} else if (name == 't12') {
		data = [
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(-1/3, 0, 0),
			vec3.fromValues(0, -1/3, 0),
			vec3.fromValues(1/3, 0, 0),
			vec3.fromValues(0, 1/3, 0),
			vec3.fromValues(1/3, 0, 0)
		];
	}

	return data;
}

function get_radio_value(group) {
	for (var i = 0; i < group.length; ++i) {
		if (group[i].checked) {
			return group[i].value;
		}
	}
}

function vector_angle(v) {
	var angle = Math.asin(v[1] / vec3.length(v));
	if (v[0] < 0) {
		angle = (v[1] < 0 ? -1 : 1) * Math.PI - angle;
	}
	return angle;
}

function random(min, max) {
	return min + Math.random() * (max - min + 1);
}

function is_point(v) {
	return v[2] == 1; 
}

function is_vector(v) {
	return v[2] == 0;
}

function point(x, y) {
	return vec3.fromValues(x, y, 1);
}

function vector(a, b) {
	var r = vec3.create();
	vec3.sub(r, b, a);
	return r;
}

function scale(a, v) {
	var r = vec3.create();
	var m = mat3.create();
	mat3.fromScaling(m, v);
	vec3.transformMat3(r, a, m);
	return r;
}

function rotate(v, angle) {
	var r = vec3.create();
	var m = mat3.create();
	mat3.fromRotation(m, angle);
	vec3.transformMat3(r, v, m);
	return r;
}

function move(a, v) {
	var r = vec3.create();
	var m = mat3.create();
	mat3.fromTranslation(m, v);
	vec3.transformMat3(r, a, m);
	return r;
}