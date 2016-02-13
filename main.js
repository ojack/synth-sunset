
import Particle from './particle.js';
var canvas, ctx, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
    

window.onload = function(){
  init();
};

function init(){
  log("init");
  ongoingTouches = new Array();
  
  touchObject = {};
   canvas = document.createElement("canvas");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   canvas.style.position = "fixed";
   canvas.style.top = "0px";
   canvas.style.left = "0px";
   ctx = canvas.getContext('2d');
  
    backgroundColor = "rgba(242, 35, 12, 0.1)";

   ctx.fillStyle = "rgb(16, 255, 207)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
   //ctx.globalCompositeOperation = "exclusion";
    audioCtx = new window.AudioContext();
      // create empty buffer
  var buffer = audioCtx.createBuffer(1, 1, 22050);
  var source = audioCtx.createBufferSource();
  source.buffer = buffer;

  // connect to output (your speakers)
  source.connect(audioCtx.destination);

  // play the file
  source.start(0);
   //             ctx.clearRect(45,45,60,60);
   //             ctx.strokeRect(50,50,50,50);
   document.body.appendChild(canvas);
   setEventHandlers();
}

function setEventHandlers(){
  canvas.addEventListener("touchstart", handleStart, false);
 
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchcancel", handleCancel, false);
  canvas.addEventListener("touchmove", handleMove, false);
   canvas.addEventListener("mousedown", handleMouseStart, false);
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
     canvas.addEventListener("mouseout", handleMouseUp, false);
      canvas.addEventListener("mouseleave", handleMouseUp, false);
}

function handleMouseStart(e){
  console.log(e.pageX);
   var color = colorForTouch(1);
 mouse = new Particle(e.pageX, e.pageY, color, ctx, audioCtx);
  // ctx.fillStyle = "#f00";
  // ctx.fillRect(evt.pageX,evt.pageY,5,5);
}

function handleMouseMove(e){
   ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if(mouse!=null){
     mouse.updatePosition(e.pageX, e.pageY, 20);
  }
}

function handleMouseUp(){
  mouse.end();
  mouse = null;
}

function handleStart(evt) {
  log("touchstart.");
  evt.preventDefault();
  
  var touches = evt.changedTouches;
  if(touches!=undefined){
    for (var i = 0; i < touches.length; i++) {
      log("touchstart:" + i + "...");
      var color = colorForTouch(touches[i]);
      touchObject[touches[i].identifier] = new Particle(touches[i].pageX, touches[i].pageY, color, ctx, audioCtx);
    
    }
  }
}

function handleMove(evt) {
  evt.preventDefault();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
  //  var color = colorForTouch(touches[i]);
  if(touchObject[touches[i].identifier]!=null){
    touchObject[touches[i].identifier].updatePosition(touches[i].pageX, touches[i].pageY, touches[i].radiusX);
  }
 
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  console.log("touchend");
 
  var touches = evt.changedTouches;

console.log(touches);
  for (var i = 0; i < touches.length; i++) {
    touchObject[touches[i].identifier].end();
    delete touchObject[touches[i].identifier];
   
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  var touches = evt.changedTouches;
  
  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }
}

function colorForTouch(touch) {
  // var r = touch.identifier % 16;
  // var g = Math.floor(touch.identifier / 3) % 16;
  // var b = Math.floor(touch.identifier / 7) % 16;
  // r = r.toString(16); // make it a hex digit
  // g = g.toString(16); // make it a hex digit
  // b = b.toString(16); // make it a hex digit
  // var color = "#" + r + g + b;
  // log("color for touch with identifier " + touch.identifier + " = " + color);
  var rand = Math.random()*4;
  if(rand<1){
    backgroundColor = "rgba(255, 255, 255, 0.1)"
    return "rgb(0, 0, 0)"
  } else if (rand < 2){
     backgroundColor = "rgba(0, 0, 0, 0.1)"
    return "rgb(255, 255, 255)"
  } else if(rand < 3){
    backgroundColor = "rgba(16, 255, 207, 0.1)"
   return "rgb(242, 35, 12)"
  } else {
    backgroundColor = "rgba(242, 35, 12, 0.1)"
    return "rgb(16, 255, 207)"
  }
 
}

function copyTouch(touch) {
  console.log(touch);
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function log(msg) {
  // var p = document.getElementById('log');
  // p.innerHTML = msg + "\n" + p.innerHTML;
}