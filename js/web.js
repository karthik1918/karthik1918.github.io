window.addEventListener("load", windowLoadHandler, false);

function windowLoadHandler() {
  canvasApp();
}

function canvasApp() {
  
  var displayCanvas = document.getElementById("displayCanvas");
  var context = displayCanvas.getContext("2d");
  
  var particleList;
  var numParticles;
  var displayWidth;
  var displayHeight;
  var timer;
  var p;
  var particleColor;
  var maxParticleRad;
  var minParticleRad;
  var initVelMax;
  var maxVelComp;
  var randAccel;
  var maxParticleRad;
  var minParticleRad;
  var fadeColor;
  
  init();
  
  function init() {
    
    numParticles = 50;
    
    maxParticleRad = 6;
    minParticleRad = 3;
    
    displayWidth = displayCanvas.width;
    displayHeight = displayCanvas.height;
    
    initVelMax = 1.5;
    maxVelComp = 2.5;
    randAccel = 0.2;
        
    particleList = {};
    createParticles();
    
    fadeColor = "rgba(0,0,0,0.1)";
    
    context.fillStyle = "#050505";
    context.fillRect(0,0,displayWidth,displayHeight);
    
    timer = setInterval(onTimer, 1000/40);
  }
  
  function createParticles() {
    var angle;
    var dist;
    var vAngle;
    var vMag;
    var r,g,b;
    var minRGB = 16;
    var maxRGB = 255;
    var alpha = 1;
    var color;
    for (var i = 0; i < numParticles; i++) {
      angle = Math.random()*2*Math.PI;
      vAngle = Math.random()*2*Math.PI;
      vMag = initVelMax*(0.6 + 0.4*Math.random());
      r = Math.floor(minRGB + Math.random()*(maxRGB-minRGB));
      g = Math.floor(minRGB + Math.random()*(maxRGB-minRGB));
      b = Math.floor(minRGB + Math.random()*(maxRGB-minRGB));
      color = "rgba(" + r + "," + g + "," + b + ","+ alpha + ")";
      var newParticle = { x: Math.random()*displayWidth,
                y: Math.random()*displayHeight,
                velX: vMag*Math.cos(vAngle),
                velY: vMag*Math.sin(vAngle),
                rad: minParticleRad+Math.random()*(maxParticleRad-minParticleRad),
                color:color}
      if (i > 0) {
        newParticle.next = particleList.first;
      }
      particleList.first = newParticle;       
    }
  }
    
  function onTimer() {
    
    //fading. This won't work very well in Chrome, IE, and Firefox - gray trails will be left behind.
    context.fillStyle = fadeColor;
    context.fillRect(0,0,displayWidth,displayHeight);
    
    //update and draw particles
    p = particleList.first;
    while (p != null) {
      //update
      lastX = p.x;
      lastY = p.y;
      
      //random accleration
      p.velX += (1-2*Math.random())*randAccel;
      p.velY += (1-2*Math.random())*randAccel;
      
      //don't let velocity get too large
      if (p.velX > maxVelComp) {
        p.velX = maxVelComp;
      }
      else if (p.velX < -maxVelComp) {
        p.velX = -maxVelComp;
      }
      if (p.velY > maxVelComp) {
        p.velY = maxVelComp;
      }
      else if (p.velY < -maxVelComp) {
        p.velY = -maxVelComp;
      }
      
      p.x += p.velX;
      p.y += p.velY;
      
      //boundary
      if (p.x > displayWidth-p.rad) {
        p.x = displayWidth-p.rad;
        p.velX *= -1;
      }
      if (p.x < p.rad) {
        p.x = p.rad;
        p.velX *= -1;
      }
      if (p.y > displayHeight-p.rad) {
        p.y = displayHeight-p.rad;
        p.velY *= -1;
      }
      if (p.y < p.rad) {
        p.y = p.rad;
        p.velY *= -1;
      }
            
      context.fillStyle = p.color;
      context.beginPath();
      context.arc(p.x, p.y, p.rad, 0, 2*Math.PI, false);
      context.closePath();
      context.fill();
      
      //advance
      p = p.next;
    }   
  }
}
