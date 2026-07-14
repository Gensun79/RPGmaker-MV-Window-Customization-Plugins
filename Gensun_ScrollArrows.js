
/*:
 * @plugindesc Allows some customization to scroll arrow animation
 * @author Gensun
 *
 * @param Frames per cycle
 * @default 40
 *
 * @param Max Displacement
 * @desc The distance outward for the scroll arrows to move. Negative distances are allowed
 * @default 2
 *
 * @param Min Displacement
 * @desc The distance inward for the scroll arrows to move. Positive distances are allowed
 * @default -2
 *
 * @param Easing Power
 * @desc 1: Linear, 2: Quadratic, 3: Cubic, 4: Quartic. Fractional powers are allowed.
 * @default 3
 *
 * @param Rounding
 * @desc For rounding to the game's pixel grid
 * @default 0
 *
 * @help
 * ============================== Version History ===============================
 * - v1.0   Jul 12 2026:	Plugin finished
 */
 
var Gensun = Gensun || {};
Gensun.ScrollArrows = Gensun.ScrollArrows || {};

  (function($) {
	  
let param = PluginManager.parameters('Gensun_ScrollArrows');
$._duration = Number(param["Frames per cycle"]);
$._max = Number(param["Max Displacement"]);
$._min = Number(param["Min Displacement"]);
$._totalDistance = $._max - $._min;
$._rounding = 0;

$.selectableInit = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(x, y, width, height) {
	$.selectableInit.call(this, x, y, width, height);
	this._arrowAnimCount = 0;
};


$.selectableUpdateArrows = Window_Selectable.prototype.update;
Window_Selectable.prototype.update = function() {
	
	Gensun.ScrollArrows.selectableUpdateArrows.call(this);
	if (this.downArrowVisible || this.upArrowVisible) {
		this.updateScrollArrows();
	}
	
};

Window_Selectable.prototype.getDisplacement = function() {
	var phase = (this._arrowAnimCount++) % $._duration;
	console.log(phase);
	phase = 2 * Math.abs($._duration / 2 - phase) / $._duration;
	return $._min + $.power(phase) * $._totalDistance;
};


if ($._rounding > 0) {
	
	const roundingInverse = 1 / $._rounding;
	$.getDisplacement = Window_selectable.prototype.getDisplacement;
	Window_Selectable.prototype.getDisplacement = function() {
		var displacement = $.getDisplacement.call(this);
		return Math.round(displacement * roundingInverse) * $._rounding;
	};
	
}

$.power = (function(power) {
	switch (power) {
		case 1:		return function(phase) { return phase; };
		case 2:		return function(phase) { return phase * phase; };
		case 3:		return function(phase) { return phase * phase * phase; };
		case 4:		return function(phase) { return phase * phase * phase * phase; };
		default:	return function(phase) { return phase ** power; };
	}
})(Number(param["Easing Power"]));


Window_Selectable.prototype.updateScrollArrows = function() {
	
	var w = this._width;
	var h = this._height;
	const b = 1.3; //Adjusts the cadance of the arrow bob motion
	var displacement = this.getDisplacement();
	const P = 24;
	const Q = P/2;

	this._downArrowSprite.move(w/2, h-Q + displacement);
	this._upArrowSprite.move(w/2, Q - displacement);
	
};

  })(Gensun.ScrollArrows);
  