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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwicGFydGljbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0VBLElBQUksTUFBSixFQUFZLEdBQVosRUFBaUIsY0FBakIsRUFBaUMsS0FBakMsRUFBd0MsV0FBeEMsRUFBcUQsUUFBckQsRUFBK0QsZUFBL0Q7QUFDQSxPQUFPLFlBQVAsR0FBc0IsT0FBTyxZQUFQLElBQXVCLE9BQU8sa0JBQVA7O0FBRzdDLE9BQU8sTUFBUCxHQUFnQixZQUFVO0FBQ3hCLFNBRHdCO0NBQVY7O0FBSWhCLFNBQVMsSUFBVCxHQUFlO0FBQ2IsTUFBSSxNQUFKLEVBRGE7QUFFYixtQkFBaUIsSUFBSSxLQUFKLEVBQWpCLENBRmE7O0FBSWIsZ0JBQWMsRUFBZCxDQUphO0FBS1osV0FBUyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVCxDQUxZO0FBTVosU0FBTyxLQUFQLEdBQWUsT0FBTyxVQUFQLENBTkg7QUFPWixTQUFPLE1BQVAsR0FBZ0IsT0FBTyxXQUFQLENBUEo7QUFRWixTQUFPLEtBQVAsQ0FBYSxRQUFiLEdBQXdCLE9BQXhCLENBUlk7QUFTWixTQUFPLEtBQVAsQ0FBYSxHQUFiLEdBQW1CLEtBQW5CLENBVFk7QUFVWixTQUFPLEtBQVAsQ0FBYSxJQUFiLEdBQW9CLEtBQXBCLENBVlk7QUFXWixRQUFNLE9BQU8sVUFBUCxDQUFrQixJQUFsQixDQUFOLENBWFk7O0FBYVgsb0JBQWtCLHdCQUFsQixDQWJXOztBQWVaLE1BQUksU0FBSixHQUFnQixtQkFBaEIsQ0FmWTtBQWdCYixNQUFJLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLE9BQU8sS0FBUCxFQUFjLE9BQU8sTUFBUCxDQUFqQzs7QUFoQmEsVUFr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Q0FBcUIsS0FBSyxRQUFMLENBQWMsV0FBZCxHQUEwQixHQUExQixHQUE4QixDQUE5QixDQUFyQixDQVRJOzs7O1FBN0VBOzs7UUEwRmUsVUFBWiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmltcG9ydCBQYXJ0aWNsZSBmcm9tICcuL3BhcnRpY2xlLmpzJztcbnZhciBjYW52YXMsIGN0eCwgb25nb2luZ1RvdWNoZXMsIG1vdXNlLCB0b3VjaE9iamVjdCwgYXVkaW9DdHgsIGJhY2tncm91bmRDb2xvcjtcbndpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpe1xuICBpbml0KCk7XG59O1xuXG5mdW5jdGlvbiBpbml0KCl7XG4gIGxvZyhcImluaXRcIik7XG4gIG9uZ29pbmdUb3VjaGVzID0gbmV3IEFycmF5KCk7XG4gIFxuICB0b3VjaE9iamVjdCA9IHt9O1xuICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgIGNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgIGNhbnZhcy5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgY2FudmFzLnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIFxuICAgIGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNDIsIDM1LCAxMiwgMC4xKVwiO1xuXG4gICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMTYsIDI1NSwgMjA3KVwiO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgIC8vY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZXhjbHVzaW9uXCI7XG4gICAgYXVkaW9DdHggPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICAgICAgLy8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuICB2YXIgYnVmZmVyID0gYXVkaW9DdHguY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgdmFyIHNvdXJjZSA9IGF1ZGlvQ3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuXG4gIC8vIGNvbm5lY3QgdG8gb3V0cHV0ICh5b3VyIHNwZWFrZXJzKVxuICBzb3VyY2UuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cbiAgLy8gcGxheSB0aGUgZmlsZVxuICBzb3VyY2Uuc3RhcnQoMCk7XG4gICAvLyAgICAgICAgICAgICBjdHguY2xlYXJSZWN0KDQ1LDQ1LDYwLDYwKTtcbiAgIC8vICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KDUwLDUwLDUwLDUwKTtcbiAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgIHNldEV2ZW50SGFuZGxlcnMoKTtcbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVycygpe1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgaGFuZGxlU3RhcnQsIGZhbHNlKTtcbiBcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVFbmQsIGZhbHNlKTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBoYW5kbGVDYW5jZWwsIGZhbHNlKTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGFuZGxlTW92ZSwgZmFsc2UpO1xuICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgaGFuZGxlTW91c2VTdGFydCwgZmFsc2UpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGhhbmRsZU1vdXNlTW92ZSwgZmFsc2UpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBoYW5kbGVNb3VzZVVwLCBmYWxzZSk7XG4gICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgaGFuZGxlTW91c2VVcCwgZmFsc2UpO1xuICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIGhhbmRsZU1vdXNlVXAsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTW91c2VTdGFydChlKXtcbiAgY29uc29sZS5sb2coZS5wYWdlWCk7XG4gICB2YXIgY29sb3IgPSBjb2xvckZvclRvdWNoKDEpO1xuIG1vdXNlID0gbmV3IFBhcnRpY2xlKGUucGFnZVgsIGUucGFnZVksIGNvbG9yLCBjdHgsIGF1ZGlvQ3R4KTtcbiAgLy8gY3R4LmZpbGxTdHlsZSA9IFwiI2YwMFwiO1xuICAvLyBjdHguZmlsbFJlY3QoZXZ0LnBhZ2VYLGV2dC5wYWdlWSw1LDUpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU1vdmUoZSl7XG4gICBjdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yO1xuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgaWYobW91c2UhPW51bGwpe1xuICAgICBtb3VzZS51cGRhdGVQb3NpdGlvbihlLnBhZ2VYLCBlLnBhZ2VZLCAyMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTW91c2VVcCgpe1xuICBtb3VzZS5lbmQoKTtcbiAgbW91c2UgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTdGFydChldnQpIHtcbiAgbG9nKFwidG91Y2hzdGFydC5cIik7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICBcbiAgdmFyIHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG4gIGlmKHRvdWNoZXMhPXVuZGVmaW5lZCl7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsb2coXCJ0b3VjaHN0YXJ0OlwiICsgaSArIFwiLi4uXCIpO1xuICAgICAgdmFyIGNvbG9yID0gY29sb3JGb3JUb3VjaCh0b3VjaGVzW2ldKTtcbiAgICAgIHRvdWNoT2JqZWN0W3RvdWNoZXNbaV0uaWRlbnRpZmllcl0gPSBuZXcgUGFydGljbGUodG91Y2hlc1tpXS5wYWdlWCwgdG91Y2hlc1tpXS5wYWdlWSwgY29sb3IsIGN0eCwgYXVkaW9DdHgpO1xuICAgIFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNb3ZlKGV2dCkge1xuICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHZhciB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAvLyAgdmFyIGNvbG9yID0gY29sb3JGb3JUb3VjaCh0b3VjaGVzW2ldKTtcbiAgaWYodG91Y2hPYmplY3RbdG91Y2hlc1tpXS5pZGVudGlmaWVyXSE9bnVsbCl7XG4gICAgdG91Y2hPYmplY3RbdG91Y2hlc1tpXS5pZGVudGlmaWVyXS51cGRhdGVQb3NpdGlvbih0b3VjaGVzW2ldLnBhZ2VYLCB0b3VjaGVzW2ldLnBhZ2VZLCB0b3VjaGVzW2ldLnJhZGl1c1gpO1xuICB9XG4gXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRW5kKGV2dCkge1xuICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc29sZS5sb2coXCJ0b3VjaGVuZFwiKTtcbiBcbiAgdmFyIHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG5cbmNvbnNvbGUubG9nKHRvdWNoZXMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB0b3VjaE9iamVjdFt0b3VjaGVzW2ldLmlkZW50aWZpZXJdLmVuZCgpO1xuICAgIGRlbGV0ZSB0b3VjaE9iamVjdFt0b3VjaGVzW2ldLmlkZW50aWZpZXJdO1xuICAgXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2FuY2VsKGV2dCkge1xuICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgbG9nKFwidG91Y2hjYW5jZWwuXCIpO1xuICB2YXIgdG91Y2hlcyA9IGV2dC5jaGFuZ2VkVG91Y2hlcztcbiAgXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIG9uZ29pbmdUb3VjaGVzLnNwbGljZShpLCAxKTsgIC8vIHJlbW92ZSBpdDsgd2UncmUgZG9uZVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbG9yRm9yVG91Y2godG91Y2gpIHtcbiAgLy8gdmFyIHIgPSB0b3VjaC5pZGVudGlmaWVyICUgMTY7XG4gIC8vIHZhciBnID0gTWF0aC5mbG9vcih0b3VjaC5pZGVudGlmaWVyIC8gMykgJSAxNjtcbiAgLy8gdmFyIGIgPSBNYXRoLmZsb29yKHRvdWNoLmlkZW50aWZpZXIgLyA3KSAlIDE2O1xuICAvLyByID0gci50b1N0cmluZygxNik7IC8vIG1ha2UgaXQgYSBoZXggZGlnaXRcbiAgLy8gZyA9IGcudG9TdHJpbmcoMTYpOyAvLyBtYWtlIGl0IGEgaGV4IGRpZ2l0XG4gIC8vIGIgPSBiLnRvU3RyaW5nKDE2KTsgLy8gbWFrZSBpdCBhIGhleCBkaWdpdFxuICAvLyB2YXIgY29sb3IgPSBcIiNcIiArIHIgKyBnICsgYjtcbiAgLy8gbG9nKFwiY29sb3IgZm9yIHRvdWNoIHdpdGggaWRlbnRpZmllciBcIiArIHRvdWNoLmlkZW50aWZpZXIgKyBcIiA9IFwiICsgY29sb3IpO1xuICB2YXIgcmFuZCA9IE1hdGgucmFuZG9tKCkqNDtcbiAgaWYocmFuZDwxKXtcbiAgICBiYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKVwiXG4gICAgcmV0dXJuIFwicmdiKDAsIDAsIDApXCJcbiAgfSBlbHNlIGlmIChyYW5kIDwgMil7XG4gICAgIGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgwLCAwLCAwLCAwLjEpXCJcbiAgICByZXR1cm4gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIlxuICB9IGVsc2UgaWYocmFuZCA8IDMpe1xuICAgIGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgxNiwgMjU1LCAyMDcsIDAuMSlcIlxuICAgcmV0dXJuIFwicmdiKDI0MiwgMzUsIDEyKVwiXG4gIH0gZWxzZSB7XG4gICAgYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI0MiwgMzUsIDEyLCAwLjEpXCJcbiAgICByZXR1cm4gXCJyZ2IoMTYsIDI1NSwgMjA3KVwiXG4gIH1cbiBcbn1cblxuZnVuY3Rpb24gY29weVRvdWNoKHRvdWNoKSB7XG4gIGNvbnNvbGUubG9nKHRvdWNoKTtcbiAgcmV0dXJuIHsgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllciwgcGFnZVg6IHRvdWNoLnBhZ2VYLCBwYWdlWTogdG91Y2gucGFnZVkgfTtcbn1cblxuZnVuY3Rpb24gb25nb2luZ1RvdWNoSW5kZXhCeUlkKGlkVG9GaW5kKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb25nb2luZ1RvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBvbmdvaW5nVG91Y2hlc1tpXS5pZGVudGlmaWVyO1xuICAgIFxuICAgIGlmIChpZCA9PSBpZFRvRmluZCkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTsgICAgLy8gbm90IGZvdW5kXG59XG5cbmZ1bmN0aW9uIGxvZyhtc2cpIHtcbiAgLy8gdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nJyk7XG4gIC8vIHAuaW5uZXJIVE1MID0gbXNnICsgXCJcXG5cIiArIHAuaW5uZXJIVE1MO1xufSIsImNsYXNzIFBhcnRpY2xlIHtcblx0Y29uc3RydWN0b3IoeCwgeSwgY29sb3IsIGN0eCwgYXVkaW9DdHgpe1xuXHRcdGNvbnNvbGUubG9nKFwiY29uc3RydWN0aW9uIHBhcnRpY2xlXCIpO1xuXHRcdHRoaXMuY29sb3IgPSBjb2xvcjtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdFx0dGhpcy5wcmV2WCA9IHg7XG5cdFx0dGhpcy5wcmV2WSA9IHk7XG5cdFx0dGhpcy5jdHggPSBjdHg7XG5cdFx0dGhpcy5vc2NpbGxhdG9yID0gYXVkaW9DdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRcdHRoaXMuZW52ZWxvcGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IDQ0MDtcblx0XHR0aGlzLm9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcblx0XHR0aGlzLmVudmVsb3BlLmNvbm5lY3QoYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXHRcdHRoaXMuZW52ZWxvcGUuZ2Fpbi52YWx1ZSA9IDA7XG5cdFx0dGhpcy5lbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBhdWRpb0N0eC5jdXJyZW50VGltZSwgMC4xKVxuXG5cdFx0dGhpcy5vc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5lbnZlbG9wZSk7XG5cdFx0dGhpcy5vc2NpbGxhdG9yLnN0YXJ0KGF1ZGlvQ3R4LmN1cnJlbnRUaW1lKTtcblx0XHR0aGlzLmF1ZGlvQ3R4ID0gYXVkaW9DdHg7XG5cdFx0dGhpcy51cGRhdGVQb3NpdGlvbih4LCB5LCAxMCk7XG5cblx0XHQgdGhpcy52aWJyYXRvID0gYXVkaW9DdHguY3JlYXRlR2FpbigpXG5cdFx0dGhpcy52aWJyYXRvLmdhaW4udmFsdWUgPSAzMDtcblx0XHR0aGlzLnZpYnJhdG8uY29ubmVjdCh0aGlzLm9zY2lsbGF0b3IuZGV0dW5lKVxuXG5cdFx0dGhpcy5sZm8gPSBhdWRpb0N0eC5jcmVhdGVPc2NpbGxhdG9yKClcblx0XHR0aGlzLmxmby5jb25uZWN0KHRoaXMudmlicmF0bylcblx0XHR0aGlzLmxmby5mcmVxdWVuY3kudmFsdWUgPSB4LzEwXG5cblx0XHR0aGlzLmxmby5zdGFydCh0aGlzLmF1ZGlvQ3R4LmN1cnJlbnRUaW1lKTtcbi8vdGhpcy52aWJyYXRvID0gdmlicmF0bztcblxuLy9sZm8uc3RvcChlbmRUaW1lICsgMilcblx0fVxuXG5cdGRyYXcoKXtcblxuXHR9XG5cblx0dXBkYXRlUG9zaXRpb24oeCwgeSwgcmFkaXVzKXtcblx0XHR0aGlzLnByZXZYID0gdGhpcy54O1xuXHRcdHRoaXMucHJldlkgPSB0aGlzLnk7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gIFx0XHRcbiAgXHRcdHZhciBkID0gTWF0aC5mbG9vcih5LzIwKjEwMCk7XG5cbiAgXHRcdFxuICBcdFx0Y29uc29sZS5sb2coZCk7XG4gIFx0XHR0aGlzLm9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gZDtcbiAgXHRcdFxuICBcdFx0dmFyIGRyYXdYID0gTWF0aC5mbG9vcih4LzEwKSoxMDtcbiAgXHRcdHZhciBkcmF3WSA9IE1hdGguZmxvb3IoeS8xMCkqMTA7XG4gIFx0XHR2YXIgZGlmZlkgPSB0aGlzLnByZXZZIC0gdGhpcy55O1xuICBcdFx0dmFyIHdpZHRoO1xuICBcdFx0aWYoZGlmZlkgPCAwLjAxKXtcbiAgXHRcdFx0d2lkdGggPSAgMTAwMDA7XG4gIFx0XHR9IGVsc2Uge1xuICBcdFx0XHR3aWR0aCA9IDMwMC1NYXRoLmFicyh0aGlzLnByZXZZIC0gdGhpcy55KSo1O1xuICBcdFx0fVxuICBcdFx0dmFyIGRpZmZYID0gIDIrTWF0aC5hYnModGhpcy5wcmV2WCAtIHRoaXMueCkqMlxuICBcdFx0dGhpcy5jdHguZmlsbFJlY3QoZHJhd1gtd2lkdGgvMiwgZHJhd1ksd2lkdGgsZGlmZlgpO1xuICBcdC8vXHR0aGlzLmVudmVsb3BlLmdhaW4udmFsdWUgPSB4LzEwO1xuICBcdFx0aWYodGhpcy52aWJyYXRvKXtcbiAgXHRcdFx0Ly90aGlzLmxmby5mcmVxdWVuY3kudmFsdWUgPSB4LzEwO1xuICBcdFx0XHR0aGlzLnZpYnJhdG8uZ2Fpbi52YWx1ZSA9IHgqMC4yO1xuICBcdFx0fVxuICBcdFx0Y29uc29sZS5sb2codGhpcy5sZm8pO1xuICBcdFx0XG4gIFx0XHQvLyB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAvLyAgIHRoaXMuY3R4LmFyYyh4LCB5LCAyMCwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAvLyAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgLy8gICB0aGlzLmN0eC5maWxsKCk7XG5cdH1cblxuXHRlbmQoKXtcblx0XG5cdFx0Ly8gdmFyIGVudmVsb3BlID0gdGhpcy5hdWRpb0N0eC5jcmVhdGVHYWluKClcbiAgLy8gXHRcdGVudmVsb3BlLmNvbm5lY3QodGhpcy5hdWRpb0N0eC5kZXN0aW5hdGlvbilcbiAgLy8gXHRcdHRoaXMub3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcbiAgXHQvL1x0dGhpcy5lbnZlbG9wZS5nYWluLnZhbHVlID0gMVxuICBcdFx0dmFyIGRpZiA9IDAuMiArIE1hdGguYWJzKHRoaXMucHJldlggLSB0aGlzLngpKjAuMTtcbiAgXG4gIHRoaXMuZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgdGhpcy5hdWRpb0N0eC5jdXJyZW50VGltZSwgZGlmKVxuICB0aGlzLm9zY2lsbGF0b3Iuc3RvcCh0aGlzLmF1ZGlvQ3R4LmN1cnJlbnRUaW1lK2RpZisyKTtcblx0fVxufVxuXG5leHBvcnQgeyBQYXJ0aWNsZSBhcyBkZWZhdWx0fSJdfQ==
