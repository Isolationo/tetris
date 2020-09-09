class Tetris {
	constructor() {
		let defaultOpts = {
			row: 18,
			col: 14,
			unit: 28,
			blocks: [],
			shapes: [],
			score: 0,
			effectRatio: 0.6,
			speed: 1000,
			fillStyle: '#999999',
			strokeStyle: 'black',
			strokeWidth: 1,
			unitStyle: null,
			status: null,
			canvas: null,
			ctx: null,
			timer: null,
			current: null,
			next: null
		};

		Object.assign(this, defaultOpts, arguments[0]);
	}

	deepClone(data) {
		if (data == void 0) return;
		let JSONStr = JSON.stringify(data);
		return JSON.parse(JSONStr);
	}

	beforeCreate() {
		let shapes = [
			{
				// x
				// x x x
				blocks: [
					{ x: 1, y: 1 },
					{ x: 1, y: 2 },
					{ x: 2, y: 2 },
					{ x: 3, y: 2 }
				],
				color: '#ff66ff'
			},
			{
				//     x
				// x x x
				blocks: [
					{ x: 3, y: 1 },
					{ x: 1, y: 2 },
					{ x: 2, y: 2 },
					{ x: 3, y: 2 }
				],
				color: '#9900ff'
			},
			{
				// x x
				//   x x
				blocks: [
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
					{ x: 2, y: 2 },
					{ x: 3, y: 2 }
				],
				color: '#009933'
			},
			{
				//   x x
				// x x
				blocks: [
					{ x: 2, y: 1 },
					{ x: 3, y: 1 },
					{ x: 1, y: 2 },
					{ x: 2, y: 2 }
				],
				color: '#cc00cc'
			},
			{
				//   x
				// x x x
				blocks: [
					{ x: 2, y: 1 },
					{ x: 1, y: 2 },
					{ x: 2, y: 2 },
					{ x: 3, y: 2 }
				],
				color: '#ff9933'
			},
			{
				// x x
				// x x
				blocks: [
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
					{ x: 1, y: 2 },
					{ x: 2, y: 2 }
				],
				color: '#990033',
				center: 'nocenter'
			},
			{
				// x x x x
				blocks: [
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
					{ x: 3, y: 1 },
					{ x: 4, y: 1 }
				],
				color: '#0033ff'
			}
		];

		this.shapes = shapes.map(
			(shape) => new Shape(shape.blocks, shape.color, shape.center)
		);
	}

	beforeRender() {
		this.ctx.save();
		this.ctx.fillStyle = this.fillStyle;
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();

		for (let i = 0; i < this.col; i++) {
			for (let j = 0; j < this.row; j++) {
				this.ctx.save();
				this.ctx.translate(this.strokeWidth, this.strokeWidth);
				this.ctx.strokeStyle = this.strokeStyle;
				this.ctx.strokeRect(this.unit * i, this.unit * j, this.unit, this.unit);
				this.ctx.restore();
			}
		}
	}

	render() {
		let draw = (block, color) => {
			this.ctx.save();
			this.ctx.translate(this.strokeWidth, this.strokeWidth);

			this.ctx.fillStyle = this.unitStyle || block.color || color;
			this.ctx.fillRect(
				(block.x - 1) * this.unit,
				(block.y - 1) * this.unit,
				this.unit,
				this.unit
			);

			this.ctx.strokeStyle = this.strokeStyle;
			this.ctx.strokeRect(
				(block.x - 1) * this.unit,
				(block.y - 1) * this.unit,
				this.unit,
				this.unit
			);

			this.ctx.restore();
		};

		this.blocks.forEach((block) => draw(block));

		if (this.current && this.current.blocks) {
			this.current.blocks.forEach((block) => draw(block, this.current.color));
		}
	}

	renderText(text) {
		let t = text || 'Game Over',
			w = this.canvas.width,
			h = this.canvas.height,
			h2 = w / 6;

		this.ctx.save();

		this.ctx.font = h2 + 'px Consolas';
		this.ctx.fillStyle = '#ff0000';
		this.ctx.strokeStyle = '#ffffff';

		let m = this.ctx.measureText(t),
			w2 = m.width;

		this.ctx.fillText(t, w / 2 - w2 / 2, h / 2 - h2 / 2);
		this.ctx.strokeText(t, w / 2 - w2 / 2, h / 2 - h2 / 2);

		this.ctx.restore();
	}

	createNext() {
		let max = this.shapes.length;
		let random = Math.floor(Math.random() * max);
		let next = this.deepClone(this.shapes[random]);

		this.next = new Shape(next.blocks, next.color, next.center);
		this.renderNext();

		return this.next;
	}

	renderNext() {
		if (this.ctx2 && this.next) {
			this.ctx2.save();
			this.ctx2.fillStyle = this.fillStyle;
			this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx2.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx2.restore();

			let shape = this.deepClone(this.next);
			let shapeClone = new Shape(shape.blocks, shape.color, shape.center);

			shapeClone.move(1, 1);
			shapeClone.blocks.forEach((block) => {
				this.ctx2.save();

				this.ctx2.fillStyle = this.unitStyle || shapeClone.color;
				this.ctx2.fillRect(
					(block.x - 1) * this.unit,
					(block.y - 1) * this.unit,
					this.unit,
					this.unit
				);

				this.ctx2.strokeStyle = this.strokeStyle;
				this.ctx2.strokeRect(
					(block.x - 1) * this.unit,
					(block.y - 1) * this.unit,
					this.unit,
					this.unit
				);

				this.ctx2.restore();
			});
		}
	}

	tick() {
		if (this.timer) clearInterval(this.timer);
		this.timer = setInterval(() => {
			if (this.current) {
				if (this.collision(this.current, 0, 1)) {
					Array.prototype.push.apply(
						this.blocks,
						this.current.blocks.map((block) => {
							block.color = this.current.color;
							return block;
						})
					);

					this.totalScore();
				} else {
					this.current.move(0, 1);
					this.beforeRender();
					this.render();

					return;
				}
			}

			this.current = this.next;
			this.current.move(Math.ceil(this.col / 2) - 1, 0);
			this.createNext();

			// 如果刚创建的 shape 遇到碰撞，则游戏结束
			if (this.collision(this.current, 0, 1)) {
				if (this.timer) clearInterval(this.timer);

				// 去掉增减再检测一遍，还遇到碰撞就向上移动一格
				if (this.collision(this.current)) {
					this.current.move(0, -1);
				}

				this.beforeRender();
				this.render();
				this.renderText();

				this.dispatchEvent('tetrisstatus', {
					status: (this.status = 'over')
				});

				return;
			}

			this.beforeRender();
			this.render();
		}, this.speed);
	}

	collision(shape, x, y, pure) {
		x = x || 0;
		y = y || 0;

		let hasCross = shape.blocks.some((block) => {
			// 普通边界碰撞检查
			if (block.x < 1 || block.x > this.col) return true;
			if (block.y < 1 || block.y > this.row) return true;

			// 增量边界碰撞检查
			if (block.x + x < 1 || block.x + x > this.col) return true;
			if (block.y + y < 1 || block.y + y > this.row) return true;

			return false;
		});

		if (pure) return hasCross;
		if (hasCross) return true;

		return shape.blocks.some((block) => {
			return this.blocks.some((block2) => {
				// 单元碰撞检测
				if (block.x === block2.x && block.y === block2.y) return true;

				// 增量单元碰撞检测
				if (block.x + x === block2.x && block.y + y === block2.y) return true;

				return false;
			});
		});
	}

	totalScore() {
		let effectRows = {},
			effectScore = 0;

		this.current.blocks.forEach((block) => {
			effectRows[block.y] = 1;
		});

		this.blocks.forEach((block) => {
			if (effectRows[block.y]) {
				effectRows[block.y] += 1;
			}
		});

		// remove full line
		for (let row in effectRows) {
			if (effectRows[row] > this.col) {
				effectScore += 1;

				this.blocks = this.blocks.filter((block) => {
					return block.y !== parseInt(row);
				});

				this.blocks.forEach((block) => {
					if (block.y < row) {
						block.y++;
					}
				});
			}
		}

		if (effectScore > 0) {
			this.score += effectScore * 100;
			this.score += Math.ceil((effectScore - 1) * this.effectRatio) * 100;

			this.changeSpeed();
			this.dispatchEvent('tetrisscore', {
				score: this.score
			});
		}
	}

	changeSpeed() {
		if (this.score < 1000) {
			this.speed = 1000;
		} else if (this.score < 2000) {
			this.speed = 800;
		} else if (this.score < 5000) {
			this.speed = 500;
		} else {
			this.speed = 300;
		}

		this.tick();
	}

	dispatchEvent(type, data) {
		if (this.canvas && this.canvas.dispatchEvent) {
			let event = document.createEvent('CustomEvent');
			event.initCustomEvent(type, true, true, data);
			this.canvas.dispatchEvent(event);
		}
	}

	play() {
		if (this.status === 'over') {
			this.restart();
			return;
		}

		if (this.status === 'pause') {
			this.beforeRender();
			this.render();
		}

		this.tick();
		this.dispatchEvent('tetrisstatus', {
			status: (this.status = 'play')
		});
	}

	pause() {
		if (this.timer) clearInterval(this.timer);

		this.renderText('Paused');
		this.dispatchEvent('tetrisstatus', {
			status: (this.status = 'pause')
		});
	}

	restart() {
		this.blocks = [];
		this.current = null;

		this.dispatchEvent('tetrisscore', {
			score: (this.score = 0)
		});

		this.dispatchEvent('tetrisstatus', {
			status: (this.status = 'ready')
		});

		this.beforeRender();
		this.createNext();
		this.play();
	}

	move(type) {
		if (this.status === 'play' && this.current) {
			switch (type) {
				case 'l':
					if (this.collision(this.current, -1, 0)) return;
					this.current.move(-1, 0);
					break;
				case 't':
					this.transform();
					break;
				case 'r':
					if (this.collision(this.current, 1, 0)) return;
					this.current.move(1, 0);
					break;
				case 'b':
				case 'd':
					if (this.collision(this.current, 0, 1)) return;
					this.current.move(0, 1);
					break;
			}

			this.beforeRender();
			this.render();
		}
	}

	transform() {
		if (this.status === 'play' && this.current) {
			if (this.current.center === 'nocenter') return;

			let shape = this.deepClone(this.current);
			let shapeClone = new Shape(shape.blocks, shape.color, shape.center);

			shapeClone.transform();

			if (this.collision(shapeClone)) {
				return;
			}

			this.current = shapeClone;
			this.beforeRender();
			this.render();
		}
	}

	mount(el) {
		if (el && el.getContext) {
			el.width = this.unit * this.col + this.strokeWidth * 2;
			el.height = this.unit * this.row + this.strokeWidth * 2;

			this.ctx = el.getContext('2d');
			this.canvas = el;

			this.beforeCreate();
			this.beforeRender();
			this.createNext();

			this.dispatchEvent('tetrisstatus', {
				status: (this.status = 'ready')
			});
		}
	}

	mount2(el) {
		if (el && el.getContext) {
			el.width = this.unit * 6;
			el.height = this.unit * 4;

			this.ctx2 = el.getContext('2d');
			this.canvas2 = el;

			if (this.next) {
				this.renderNext();
			}
		}
	}
}

class Shape {
	constructor(blocks, color, center) {
		this.blocks = blocks;
		this.color = color;

		if (center) this.center = center;
	}

	move(x, y) {
		this.blocks.forEach((block) => {
			block.x += x;
			block.y += y;
		});
	}

	transform() {
		if (this.center === 'nocenter') return;

		let matrix = this.blocks,
			size = matrix.length,
			c = this.center || Math.ceil(size / 2);

		for (let i = 0; i < size; i++) {
			let dx = matrix[i].x - matrix[c].x;
			let dy = matrix[i].y - matrix[c].y;

			matrix[i].x = matrix[c].x - dy;
			matrix[i].y = matrix[c].y + dx;
		}
	}
}

let tetris = new Tetris();
let canvas = document.querySelector('.tetris');
var textNode = document.querySelector('.score');
var canvas2 = document.querySelector('.precanvas');

window.addEventListener('tetrisstatus', (event) => {
	console.log(event.detail.status);
});

window.addEventListener('tetrisscore', (event) => {
	textNode.textContent = 'Score: ' + event.detail.score;
});

let keyHistory = '';
let keyCodes = { 37: 'l', 38: 't', 39: 'r', 40: 'b' };
window.addEventListener('keydown', (event) => {
	let keyCode = keyCodes[event.keyCode];
	if (keyCode) {
		tetris.move(keyCode);
	}

	if (keyHistory == '38384040373937396665666513') {
		if (event.keyCode === 32) {
			tetris.createNext();
		}
		return;
	}

	keyHistory += event.keyCode;
	keyHistory = keyHistory.slice(-26);
});

tetris.mount(canvas);
tetris.mount2(canvas2);
// tetris.play();

function play() {
	if (tetris.status === 'play') {
		tetris.pause();
	} else {
		tetris.play();
	}
}

function restart() {
	tetris.restart();
}
