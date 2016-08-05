function SiriWave(opt){
	this.opt = opt || {};

	this.K = 2;
	this.F = 6;
	this.speed = 0.1;
	this.noise = 0.1;
	this.phase = 0.3;

	this.dpr = window.devicePixelRatio;
	if (!this.dpr) this.dpr = 1;
	this.width = this.dpr * (this.opt.width || 320);
	this.height = this.dpr * (this.opt.height || 100);
	this.MAX = (this.height/2)-4;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.width = (this.width/this.dpr)+'px';
	this.canvas.style.height = (this.height/this.dpr)+'px';
	(this.opt.container || document.body).appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');

	this.run = false;
}

SiriWave.prototype = {

	_globalAttenuationFn: function(x){
		return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
	},

	_drawLine: function(attenuation, color, width, phase, freq){

		this.ctx.moveTo(0,0);
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width || (1.5 * this.dpr);
		var x, y;
		for (var i=-this.K; i<=this.K; i+=0.01) {
			x = this.width*((i+this.K)/(this.K*2));
			y = this.height/2 + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin((this.F * freq)*i-(this.phase + phase));
			this.ctx.lineTo(x, y);
		}
		this.ctx.stroke();
	},

	_clear: function(){
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.globalCompositeOperation = 'source-over';
	},

	_draw: function(){
		if (!this.run) return;

		this.phase = (this.phase+this.speed)%(Math.PI*64);
		this._clear();
		this._drawLine(-2, 'rgba(255, 128, 255,0.1)',0, 2.0, 1.05);
		this._drawLine(-6, 'rgba(255, 128, 255,0.2)',0, 1.0, 0.95);
		this._drawLine(4, 'rgba(255, 128, 255,0.4)',0, 0.35, 1.2);
		this._drawLine(2, 'rgba(255, 128, 255,0.6)',0,0.25, 0.8);
		this._drawLine(1, 'rgba(255, 128, 255,1)', 1.5, 0.0, 1.0);
		this._drawLine(-3, 'rgba(255, 128, 255,0.2)', 1.5, 0.5, 0.5);

		requestAnimationFrame(this._draw.bind(this), 1000);
	},

	start: function(){
		if (this.run == true) {
			return;
		}
		this.phase = 0;
		this.run = true;
		this._draw();
	},

	stop: function(){
		//this.speed = 0;
		this.phase = 0;
		//this.noise = 0;
		this.run = false;
	},

	setNoise: function(v){
		this.noise = Math.min(v, 1)*this.MAX;
	},

	setSpeed: function(v){
		this.speed = v;
	},

	set: function(noise, speed) {
		this.setNoise(noise);
		this.setSpeed(speed);
	}

};
