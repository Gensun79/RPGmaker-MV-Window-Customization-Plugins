
/*:
 * @plugindesc Allows some customization to cursor background easing
 * @author Gensun
 *
 * @param Frames per cycle
 * @default 40
 *
 * @param Peak Opacity
 * @desc Enter a value between 0 and 1. Peak values below base values are allowed.
 * @default 0.8
 *
 * @param Base Opacity
 * @desc Enter a value between 0 and 1. Peak values below base values are allowed.
 * @default 0.5
 *
 * @param Easing Power
 * @desc 1: Linear, 2: Quadratic, 3: Cubic, 4: Quartic. Fractional powers are allowed.
 * @default 3
 *
 * @help
 * ============================== Version History ===============================
 * - v1.0   Jun 23 2026:	Public release
 */
 
var Gensun = Gensun || {};
Gensun.Cursor = Gensun.Cursor || {};

  (function() {
	  
let param = PluginManager.parameters('Gensun_CursorBlink');
Gensun.Cursor._duration = Number(param["Frames per cycle"]);
Gensun.Cursor._opacityPeak = Number(param["Peak Opacity"]);
Gensun.Cursor._opacityBase = Number(param["Base Opacity"]);
Gensun.Cursor._opacityDifferential = Gensun.Cursor._opacityPeak - Gensun.Cursor._opacityBase;

Gensun.Cursor.power = (function(power) {
	switch (power) {
		case 1:		return function(blinkPhase) { return blinkPhase; };
		case 2:		return function(blinkPhase) { return blinkPhase * blinkPhase; };
		case 3:		return function(blinkPhase) { return blinkPhase * blinkPhase * blinkPhase; };
		case 4:		return function(blinkPhase) { return blinkPhase * blinkPhase * blinkPhase * blinkPhase; };
		default:	return function(blinkPhase) { return blinkPhase ** power; };
	}
})(Number(param["Easing Power"]));

Window.prototype.cursorOpacity = function() {
	var blinkPhase = this._animationCount % Gensun.Cursor._duration;
	blinkPhase = 2 * Math.abs(Gensun.Cursor._duration/2 - blinkPhase) / Gensun.Cursor._duration;
	return Gensun.Cursor._opacityBase + Gensun.Cursor.power(blinkPhase) * Gensun.Cursor._opacityDifferential;
};
	  
Window.prototype._updateCursor = function() {
    var cursorOpacity = this.contentsOpacity;
    if (this.active) {
        cursorOpacity *= this.cursorOpacity();
    }
    this._windowCursorSprite.alpha = cursorOpacity / 255;
    this._windowCursorSprite.visible = this.isOpen();
};

  })();
  
