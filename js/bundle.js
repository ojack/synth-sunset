(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _particle = require("./particle.js");

var _particle2 = _interopRequireDefault(_particle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas, ctx, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.onload = function () {
  init();
};

function init() {
  log("init");
  ongoingTouches = new Array();
  backgroundColor = "rgba(255, 255, 255, 0.1)";
  touchObject = {};
  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  ctx = canvas.getContext('2d');
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

function setEventHandlers() {
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

function handleMouseStart(e) {
  console.log(e.pageX);
  var color = colorForTouch(1);
  mouse = new _particle2.default(e.pageX, e.pageY, color, ctx, audioCtx);
  // ctx.fillStyle = "#f00";
  // ctx.fillRect(evt.pageX,evt.pageY,5,5);
}

function handleMouseMove(e) {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (mouse != null) {
    mouse.updatePosition(e.pageX, e.pageY, 20);
  }
}

function handleMouseUp() {
  mouse.end();
  mouse = null;
}

function handleStart(evt) {
  log("touchstart.");
  evt.preventDefault();

  var touches = evt.changedTouches;
  if (touches != undefined) {
    for (var i = 0; i < touches.length; i++) {
      log("touchstart:" + i + "...");
      var color = colorForTouch(touches[i]);
      touchObject[touches[i].identifier] = new _particle2.default(touches[i].pageX, touches[i].pageY, color, ctx, audioCtx);
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
    if (touchObject[touches[i].identifier] != null) {
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
    ongoingTouches.splice(i, 1); // remove it; we're done
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
  var rand = Math.random() * 4;
  if (rand < 1) {
    backgroundColor = "rgba(255, 255, 255, 0.1)";
    return "rgb(0, 0, 0)";
  } else if (rand < 2) {
    backgroundColor = "rgba(0, 0, 0, 0.1)";
    return "rgb(255, 255, 255)";
  } else if (rand < 3) {
    backgroundColor = "rgba(16, 255, 207, 0.1)";
    return "rgb(242, 35, 12)";
  } else {
    backgroundColor = "rgba(242, 35, 12, 0.1)";
    return "rgb(16, 255, 207)";
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
  return -1; // not found
}

function log(msg) {
  // var p = document.getElementById('log');
  // p.innerHTML = msg + "\n" + p.innerHTML;
}

},{"./particle.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
	function Particle(x, y, color, ctx, audioCtx) {
		_classCallCheck(this, Particle);

		console.log("construction particle");
		this.color = color;
		this.x = x;
		this.y = y;
		this.prevX = x;
		this.prevY = y;
		this.ctx = ctx;
		this.oscillator = audioCtx.createOscillator();
		this.envelope = audioCtx.createGain();
		this.oscillator.frequency.value = 440;
		this.oscillator.type = 'sine';
		this.envelope.connect(audioCtx.destination);
		this.envelope.gain.value = 0;
		this.envelope.gain.setTargetAtTime(1, audioCtx.currentTime, 0.1);

		this.oscillator.connect(this.envelope);
		this.oscillator.start(audioCtx.currentTime);
		this.audioCtx = audioCtx;
		this.updatePosition(x, y, 10);

		this.vibrato = audioCtx.createGain();
		this.vibrato.gain.value = 30;
		this.vibrato.connect(this.oscillator.detune);

		this.lfo = audioCtx.createOscillator();
		this.lfo.connect(this.vibrato);
		this.lfo.frequency.value = x / 10;

		this.lfo.start(this.audioCtx.currentTime);
		//this.vibrato = vibrato;

		//lfo.stop(endTime + 2)
	}

	_createClass(Particle, [{
		key: "draw",
		value: function draw() {}
	}, {
		key: "updatePosition",
		value: function updatePosition(x, y, radius) {
			this.prevX = this.x;
			this.prevY = this.y;
			this.x = x;
			this.y = y;
			this.ctx.fillStyle = this.color;

			var d = Math.floor(y / 20 * 100);

			console.log(d);
			this.oscillator.detune.value = d;

			var drawX = Math.floor(x / 10) * 10;
			var drawY = Math.floor(y / 10) * 10;
			var diffY = this.prevY - this.y;
			var width;
			if (diffY < 0.01) {
				width = 10000;
			} else {
				width = 300 - Math.abs(this.prevY - this.y) * 5;
			}
			var diffX = 2 + Math.abs(this.prevX - this.x) * 2;
			this.ctx.fillRect(drawX - width / 2, drawY, width, diffX);
			//	this.envelope.gain.value = x/10;
			if (this.vibrato) {
				//this.lfo.frequency.value = x/10;
				this.vibrato.gain.value = x * 0.2;
			}
			console.log(this.lfo);

			// this.ctx.beginPath();
			//   this.ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
			//   this.ctx.fillStyle = this.color;
			//   this.ctx.fill();
		}
	}, {
		key: "end",
		value: function end() {

			// var envelope = this.audioCtx.createGain()
			// 		envelope.connect(this.audioCtx.destination)
			// 		this.oscillator.connect(envelope);
			//	this.envelope.gain.value = 1
			var dif = 0.2 + Math.abs(this.prevX - this.x) * 0.1;

			this.envelope.gain.setTargetAtTime(0, this.audioCtx.currentTime, dif);
			this.oscillator.stop(this.audioCtx.currentTime + dif + 2);
		}
	}]);

	return Particle;
}();

exports.default = Particle;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwicGFydGljbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0VBLElBQUksTUFBSixFQUFZLEdBQVosRUFBaUIsY0FBakIsRUFBaUMsS0FBakMsRUFBd0MsV0FBeEMsRUFBcUQsUUFBckQsRUFBK0QsZUFBL0Q7QUFDQSxPQUFPLFlBQVAsR0FBc0IsT0FBTyxZQUFQLElBQXVCLE9BQU8sa0JBQVA7O0FBRzdDLE9BQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3hCLFNBRHdCO0NBQVY7O0FBSWhCLFNBQVMsSUFBVCxHQUFlO0FBQ2IsTUFBSSxNQUFKLEVBRGE7QUFFYixtQkFBaUIsSUFBSSxLQUFKLEVBQWpCLENBRmE7QUFHYixvQkFBa0IsMEJBQWxCLENBSGE7QUFJYixnQkFBYyxFQUFkLENBSmE7QUFLWixXQUFTLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFULENBTFk7QUFNWixTQUFPLEtBQVAsR0FBZSxPQUFPLFVBQVAsQ0FOSDtBQU9aLFNBQU8sTUFBUCxHQUFnQixPQUFPLFdBQVAsQ0FQSjtBQVFaLFNBQU8sS0FBUCxDQUFhLFFBQWIsR0FBd0IsT0FBeEIsQ0FSWTtBQVNaLFNBQU8sS0FBUCxDQUFhLEdBQWIsR0FBbUIsS0FBbkIsQ0FUWTtBQVVaLFNBQU8sS0FBUCxDQUFhLElBQWIsR0FBb0IsS0FBcEIsQ0FWWTtBQVdaLFFBQU0sT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQU47O0FBWFksVUFhWCxHQUFXLElBQUksT0FBTyxZQUFQLEVBQWY7O0FBYlcsTUFlVCxTQUFTLFNBQVMsWUFBVCxDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixLQUE1QixDQUFULENBZlM7QUFnQmIsTUFBSSxTQUFTLFNB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LCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuaW1wb3J0IFBhcnRpY2xlIGZyb20gJy4vcGFydGljbGUuanMnO1xudmFyIGNhbnZhcywgY3R4LCBvbmdvaW5nVG91Y2hlcywgbW91c2UsIHRvdWNoT2JqZWN0LCBhdWRpb0N0eCwgYmFja2dyb3VuZENvbG9yO1xud2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICBcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XG4gIGluaXQoKTtcbn07XG5cbmZ1bmN0aW9uIGluaXQoKXtcbiAgbG9nKFwiaW5pdFwiKTtcbiAgb25nb2luZ1RvdWNoZXMgPSBuZXcgQXJyYXkoKTtcbiAgYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIjtcbiAgdG91Y2hPYmplY3QgPSB7fTtcbiAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICBjYW52YXMuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICBjYW52YXMuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgIGNhbnZhcy5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgLy9jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJleGNsdXNpb25cIjtcbiAgICBhdWRpb0N0eCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gICAgICAvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG4gIHZhciBidWZmZXIgPSBhdWRpb0N0eC5jcmVhdGVCdWZmZXIoMSwgMSwgMjIwNTApO1xuICB2YXIgc291cmNlID0gYXVkaW9DdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cbiAgLy8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG4gIHNvdXJjZS5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcblxuICAvLyBwbGF5IHRoZSBmaWxlXG4gIHNvdXJjZS5zdGFydCgwKTtcbiAgIC8vICAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoNDUsNDUsNjAsNjApO1xuICAgLy8gICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoNTAsNTAsNTAsNTApO1xuICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgc2V0RXZlbnRIYW5kbGVycygpO1xufVxuXG5mdW5jdGlvbiBzZXRFdmVudEhhbmRsZXJzKCl7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVTdGFydCwgZmFsc2UpO1xuIFxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZUVuZCwgZmFsc2UpO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIGhhbmRsZUNhbmNlbCwgZmFsc2UpO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBoYW5kbGVNb3ZlLCBmYWxzZSk7XG4gICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBoYW5kbGVNb3VzZVN0YXJ0LCBmYWxzZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgaGFuZGxlTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGhhbmRsZU1vdXNlVXAsIGZhbHNlKTtcbiAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBoYW5kbGVNb3VzZVVwLCBmYWxzZSk7XG4gICAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgaGFuZGxlTW91c2VVcCwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZVN0YXJ0KGUpe1xuICBjb25zb2xlLmxvZyhlLnBhZ2VYKTtcbiAgIHZhciBjb2xvciA9IGNvbG9yRm9yVG91Y2goMSk7XG4gbW91c2UgPSBuZXcgUGFydGljbGUoZS5wYWdlWCwgZS5wYWdlWSwgY29sb3IsIGN0eCwgYXVkaW9DdHgpO1xuICAvLyBjdHguZmlsbFN0eWxlID0gXCIjZjAwXCI7XG4gIC8vIGN0eC5maWxsUmVjdChldnQucGFnZVgsZXZ0LnBhZ2VZLDUsNSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vdXNlTW92ZShlKXtcbiAgIGN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3I7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBpZihtb3VzZSE9bnVsbCl7XG4gICAgIG1vdXNlLnVwZGF0ZVBvc2l0aW9uKGUucGFnZVgsIGUucGFnZVksIDIwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZVVwKCl7XG4gIG1vdXNlLmVuZCgpO1xuICBtb3VzZSA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVN0YXJ0KGV2dCkge1xuICBsb2coXCJ0b3VjaHN0YXJ0LlwiKTtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gIFxuICB2YXIgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlcztcbiAgaWYodG91Y2hlcyE9dW5kZWZpbmVkKXtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxvZyhcInRvdWNoc3RhcnQ6XCIgKyBpICsgXCIuLi5cIik7XG4gICAgICB2YXIgY29sb3IgPSBjb2xvckZvclRvdWNoKHRvdWNoZXNbaV0pO1xuICAgICAgdG91Y2hPYmplY3RbdG91Y2hlc1tpXS5pZGVudGlmaWVyXSA9IG5ldyBQYXJ0aWNsZSh0b3VjaGVzW2ldLnBhZ2VYLCB0b3VjaGVzW2ldLnBhZ2VZLCBjb2xvciwgY3R4LCBhdWRpb0N0eCk7XG4gICAgXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1vdmUoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgdmFyIHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gIC8vICB2YXIgY29sb3IgPSBjb2xvckZvclRvdWNoKHRvdWNoZXNbaV0pO1xuICBpZih0b3VjaE9iamVjdFt0b3VjaGVzW2ldLmlkZW50aWZpZXJdIT1udWxsKXtcbiAgICB0b3VjaE9iamVjdFt0b3VjaGVzW2ldLmlkZW50aWZpZXJdLnVwZGF0ZVBvc2l0aW9uKHRvdWNoZXNbaV0ucGFnZVgsIHRvdWNoZXNbaV0ucGFnZVksIHRvdWNoZXNbaV0ucmFkaXVzWCk7XG4gIH1cbiBcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVFbmQoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zb2xlLmxvZyhcInRvdWNoZW5kXCIpO1xuIFxuICB2YXIgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlcztcblxuY29uc29sZS5sb2codG91Y2hlcyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHRvdWNoT2JqZWN0W3RvdWNoZXNbaV0uaWRlbnRpZmllcl0uZW5kKCk7XG4gICAgZGVsZXRlIHRvdWNoT2JqZWN0W3RvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICBcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDYW5jZWwoZXZ0KSB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBsb2coXCJ0b3VjaGNhbmNlbC5cIik7XG4gIHZhciB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzO1xuICBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgb25nb2luZ1RvdWNoZXMuc3BsaWNlKGksIDEpOyAgLy8gcmVtb3ZlIGl0OyB3ZSdyZSBkb25lXG4gIH1cbn1cblxuZnVuY3Rpb24gY29sb3JGb3JUb3VjaCh0b3VjaCkge1xuICAvLyB2YXIgciA9IHRvdWNoLmlkZW50aWZpZXIgJSAxNjtcbiAgLy8gdmFyIGcgPSBNYXRoLmZsb29yKHRvdWNoLmlkZW50aWZpZXIgLyAzKSAlIDE2O1xuICAvLyB2YXIgYiA9IE1hdGguZmxvb3IodG91Y2guaWRlbnRpZmllciAvIDcpICUgMTY7XG4gIC8vIHIgPSByLnRvU3RyaW5nKDE2KTsgLy8gbWFrZSBpdCBhIGhleCBkaWdpdFxuICAvLyBnID0gZy50b1N0cmluZygxNik7IC8vIG1ha2UgaXQgYSBoZXggZGlnaXRcbiAgLy8gYiA9IGIudG9TdHJpbmcoMTYpOyAvLyBtYWtlIGl0IGEgaGV4IGRpZ2l0XG4gIC8vIHZhciBjb2xvciA9IFwiI1wiICsgciArIGcgKyBiO1xuICAvLyBsb2coXCJjb2xvciBmb3IgdG91Y2ggd2l0aCBpZGVudGlmaWVyIFwiICsgdG91Y2guaWRlbnRpZmllciArIFwiID0gXCIgKyBjb2xvcik7XG4gIHZhciByYW5kID0gTWF0aC5yYW5kb20oKSo0O1xuICBpZihyYW5kPDEpe1xuICAgIGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCJcbiAgICByZXR1cm4gXCJyZ2IoMCwgMCwgMClcIlxuICB9IGVsc2UgaWYgKHJhbmQgPCAyKXtcbiAgICAgYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDAuMSlcIlxuICAgIHJldHVybiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gIH0gZWxzZSBpZihyYW5kIDwgMyl7XG4gICAgYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDE2LCAyNTUsIDIwNywgMC4xKVwiXG4gICByZXR1cm4gXCJyZ2IoMjQyLCAzNSwgMTIpXCJcbiAgfSBlbHNlIHtcbiAgICBiYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjQyLCAzNSwgMTIsIDAuMSlcIlxuICAgIHJldHVybiBcInJnYigxNiwgMjU1LCAyMDcpXCJcbiAgfVxuIFxufVxuXG5mdW5jdGlvbiBjb3B5VG91Y2godG91Y2gpIHtcbiAgY29uc29sZS5sb2codG91Y2gpO1xuICByZXR1cm4geyBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLCBwYWdlWDogdG91Y2gucGFnZVgsIHBhZ2VZOiB0b3VjaC5wYWdlWSB9O1xufVxuXG5mdW5jdGlvbiBvbmdvaW5nVG91Y2hJbmRleEJ5SWQoaWRUb0ZpbmQpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbmdvaW5nVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IG9uZ29pbmdUb3VjaGVzW2ldLmlkZW50aWZpZXI7XG4gICAgXG4gICAgaWYgKGlkID09IGlkVG9GaW5kKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xOyAgICAvLyBub3QgZm91bmRcbn1cblxuZnVuY3Rpb24gbG9nKG1zZykge1xuICAvLyB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2cnKTtcbiAgLy8gcC5pbm5lckhUTUwgPSBtc2cgKyBcIlxcblwiICsgcC5pbm5lckhUTUw7XG59IiwiY2xhc3MgUGFydGljbGUge1xuXHRjb25zdHJ1Y3Rvcih4LCB5LCBjb2xvciwgY3R4LCBhdWRpb0N0eCl7XG5cdFx0Y29uc29sZS5sb2coXCJjb25zdHJ1Y3Rpb24gcGFydGljbGVcIik7XG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yO1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0XHR0aGlzLnByZXZYID0geDtcblx0XHR0aGlzLnByZXZZID0geTtcblx0XHR0aGlzLmN0eCA9IGN0eDtcblx0XHR0aGlzLm9zY2lsbGF0b3IgPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdFx0dGhpcy5lbnZlbG9wZSA9IGF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKTtcblx0XHR0aGlzLm9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuXHRcdHRoaXMub3NjaWxsYXRvci50eXBlID0gJ3NpbmUnO1xuXHRcdHRoaXMuZW52ZWxvcGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cdFx0dGhpcy5lbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcblx0XHR0aGlzLmVudmVsb3BlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEsIGF1ZGlvQ3R4LmN1cnJlbnRUaW1lLCAwLjEpXG5cblx0XHR0aGlzLm9zY2lsbGF0b3IuY29ubmVjdCh0aGlzLmVudmVsb3BlKTtcblx0XHR0aGlzLm9zY2lsbGF0b3Iuc3RhcnQoYXVkaW9DdHguY3VycmVudFRpbWUpO1xuXHRcdHRoaXMuYXVkaW9DdHggPSBhdWRpb0N0eDtcblx0XHR0aGlzLnVwZGF0ZVBvc2l0aW9uKHgsIHksIDEwKTtcblxuXHRcdCB0aGlzLnZpYnJhdG8gPSBhdWRpb0N0eC5jcmVhdGVHYWluKClcblx0XHR0aGlzLnZpYnJhdG8uZ2Fpbi52YWx1ZSA9IDMwO1xuXHRcdHRoaXMudmlicmF0by5jb25uZWN0KHRoaXMub3NjaWxsYXRvci5kZXR1bmUpXG5cblx0XHR0aGlzLmxmbyA9IGF1ZGlvQ3R4LmNyZWF0ZU9zY2lsbGF0b3IoKVxuXHRcdHRoaXMubGZvLmNvbm5lY3QodGhpcy52aWJyYXRvKVxuXHRcdHRoaXMubGZvLmZyZXF1ZW5jeS52YWx1ZSA9IHgvMTBcblxuXHRcdHRoaXMubGZvLnN0YXJ0KHRoaXMuYXVkaW9DdHguY3VycmVudFRpbWUpO1xuLy90aGlzLnZpYnJhdG8gPSB2aWJyYXRvO1xuXG4vL2xmby5zdG9wKGVuZFRpbWUgKyAyKVxuXHR9XG5cblx0ZHJhdygpe1xuXG5cdH1cblxuXHR1cGRhdGVQb3NpdGlvbih4LCB5LCByYWRpdXMpe1xuXHRcdHRoaXMucHJldlggPSB0aGlzLng7XG5cdFx0dGhpcy5wcmV2WSA9IHRoaXMueTtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdFx0dGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgXHRcdFxuICBcdFx0dmFyIGQgPSBNYXRoLmZsb29yKHkvMjAqMTAwKTtcblxuICBcdFx0XG4gIFx0XHRjb25zb2xlLmxvZyhkKTtcbiAgXHRcdHRoaXMub3NjaWxsYXRvci5kZXR1bmUudmFsdWUgPSBkO1xuICBcdFx0XG4gIFx0XHR2YXIgZHJhd1ggPSBNYXRoLmZsb29yKHgvMTApKjEwO1xuICBcdFx0dmFyIGRyYXdZID0gTWF0aC5mbG9vcih5LzEwKSoxMDtcbiAgXHRcdHZhciBkaWZmWSA9IHRoaXMucHJldlkgLSB0aGlzLnk7XG4gIFx0XHR2YXIgd2lkdGg7XG4gIFx0XHRpZihkaWZmWSA8IDAuMDEpe1xuICBcdFx0XHR3aWR0aCA9ICAxMDAwMDtcbiAgXHRcdH0gZWxzZSB7XG4gIFx0XHRcdHdpZHRoID0gMzAwLU1hdGguYWJzKHRoaXMucHJldlkgLSB0aGlzLnkpKjU7XG4gIFx0XHR9XG4gIFx0XHR2YXIgZGlmZlggPSAgMitNYXRoLmFicyh0aGlzLnByZXZYIC0gdGhpcy54KSoyXG4gIFx0XHR0aGlzLmN0eC5maWxsUmVjdChkcmF3WC13aWR0aC8yLCBkcmF3WSx3aWR0aCxkaWZmWCk7XG4gIFx0Ly9cdHRoaXMuZW52ZWxvcGUuZ2Fpbi52YWx1ZSA9IHgvMTA7XG4gIFx0XHRpZih0aGlzLnZpYnJhdG8pe1xuICBcdFx0XHQvL3RoaXMubGZvLmZyZXF1ZW5jeS52YWx1ZSA9IHgvMTA7XG4gIFx0XHRcdHRoaXMudmlicmF0by5nYWluLnZhbHVlID0geCowLjI7XG4gIFx0XHR9XG4gIFx0XHRjb25zb2xlLmxvZyh0aGlzLmxmbyk7XG4gIFx0XHRcbiAgXHRcdC8vIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIC8vICAgdGhpcy5jdHguYXJjKHgsIHksIDIwLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgIC8vICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAvLyAgIHRoaXMuY3R4LmZpbGwoKTtcblx0fVxuXG5cdGVuZCgpe1xuXHRcblx0XHQvLyB2YXIgZW52ZWxvcGUgPSB0aGlzLmF1ZGlvQ3R4LmNyZWF0ZUdhaW4oKVxuICAvLyBcdFx0ZW52ZWxvcGUuY29ubmVjdCh0aGlzLmF1ZGlvQ3R4LmRlc3RpbmF0aW9uKVxuICAvLyBcdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QoZW52ZWxvcGUpO1xuICBcdC8vXHR0aGlzLmVudmVsb3BlLmdhaW4udmFsdWUgPSAxXG4gIFx0XHR2YXIgZGlmID0gMC4yICsgTWF0aC5hYnModGhpcy5wcmV2WCAtIHRoaXMueCkqMC4xO1xuICBcbiAgdGhpcy5lbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCB0aGlzLmF1ZGlvQ3R4LmN1cnJlbnRUaW1lLCBkaWYpXG4gIHRoaXMub3NjaWxsYXRvci5zdG9wKHRoaXMuYXVkaW9DdHguY3VycmVudFRpbWUrZGlmKzIpO1xuXHR9XG59XG5cbmV4cG9ydCB7IFBhcnRpY2xlIGFzIGRlZmF1bHR9Il19
