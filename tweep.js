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