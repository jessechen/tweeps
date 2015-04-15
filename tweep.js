var Tweep = function(x, y, selector) {
    this.xpos = x;
    this.ypos = y;

    this.xvel = 0;
    this.yvel = 0;

    this.selector = selector;
};

Tweep.prototype.updatePosition = function() {
    this.xpos += this.xvel;
    this.ypos += this.yvel;
};

Tweep.prototype.distanceFrom = function(other) {
    var xdiff = this.xpos - other.xpos;
    var ydiff = this.ypos - other.ypos;
    return Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
};