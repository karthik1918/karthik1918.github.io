// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// ends requestAnimationFrame polyfill

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;
// para calcular el radio
var a = 10;
var b = 30;
// dot radius
var r = 3;
// how many dots
var howMany = 40;
var particlesRy = [];
//ctx.globalAlpha = .5;
ctx.lineWidth = 2;

function Particles(a, b) {

  this.pm = Math.random() < 0.5 ? -1 : 1; //plus or minus

  this.drift = this.pm * Math.round(Math.random() * 8) + 1;
  this.rise = -1 * Math.round(Math.random() * 8) + 1;

  this.hue = Math.round(Math.random() * 360) + 1;
  this.color = "hsl(" + this.hue + ",100%, 60%)";

  this.x = Math.round(Math.random() * cw) + 1;
  this.y = Math.round(Math.random() * ch) + 1;
}

for (var i = 0; i < howMany; i++) {
  createParticles(i);
}

function createParticles(i) {
  particlesRy[i] = new Particles(a, b);
  compare(i);
}

function buildDot(j) {
  ctx.beginPath();
  ctx.fillStyle = particlesRy[j].color;
  ctx.strokeStyle = particlesRy[j].color;
  ctx.moveTo(particlesRy[j].x + r, particlesRy[j].y);
  ctx.arc(particlesRy[j].x, particlesRy[j].y, r, 0, 2 * Math.PI);
  ctx.shadowBlur = 0;
  ctx.shadowColor = particlesRy[j].color;
  ctx.fill();
}

function Update() {

  for (var j = 0; j < particlesRy.length; j++) {
    particlesRy[j].y += particlesRy[j].rise;
    particlesRy[j].x += particlesRy[j].drift;

    if (particlesRy[j].drift == 0) {
      particlesRy[j].drift += 2 * particlesRy[j].pm;
    }
    if (particlesRy[j].rise == 0) {
      particlesRy[j].rise += 2 * particlesRy[j].pm;
    }

    if (particlesRy[j].y <= 0 ||  particlesRy[j].y >= ch) {
      particlesRy[j].rise = -1 * particlesRy[j].rise;
      /*particlesRy[j].rise+=.5;*/
    }

    if (particlesRy[j].x <= 0 || particlesRy[j].x >= cw) {
      particlesRy[j].drift = -1 * particlesRy[j].drift;
    }

    compare(j);

    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, cw, ch);
  }

  requestId = window.requestAnimationFrame(Update);
}

function compare(n) {

  for (var c = 0; c < particlesRy.length; c++) {
    if (n !== c) {

      var cx = Math.abs(particlesRy[c].x - particlesRy[n].x);
      var cy = Math.abs(particlesRy[c].y - particlesRy[n].y);
      var hyp = Math.sqrt(cx * cx + cy * cy);

      if (hyp < 200) {
        var alpha = (100 / hyp <= 1) ? 100 / hyp : 1;
        var grd = ctx.createLinearGradient(particlesRy[n].x, particlesRy[n].y, particlesRy[c].x, particlesRy[c].y);
        grd.addColorStop(0, "hsla(" + particlesRy[n].hue + ",100%, 60%," + alpha + ")");
        grd.addColorStop(1, "hsla(" + particlesRy[c].hue + ",100%, 60%," + alpha + ")");
        ctx.strokeStyle = grd;
        ctx.shadowBlur = 20;
        ctx.shadowColor = grd;
        ctx.beginPath();
        ctx.moveTo(particlesRy[n].x, particlesRy[n].y);
        ctx.lineTo(particlesRy[c].x, particlesRy[c].y);
        ctx.stroke();
      }

    }

    buildDot(n);
  }

}

function start() {
  requestId = window.requestAnimationFrame(Update);
  stopped = false;
}

function stopAnim() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
  }
  stopped = true;
}

window.addEventListener("load", start(), false);
c.addEventListener("click", function() {
  (stopped == true) ? start(): stopAnim();
}, false);