var TWEEPS;

function update(tweep, TWEEPS) {
    attractToCenterOfMass(tweep, TWEEPS);
    tweep.updatePosition();
}

function attractToCenterOfMass(tweep, TWEEPS) {
    console.log(calculateCenterOfMass);
    var centerOfMass = calculateCenterOfMass(TWEEPS);
    tweep.xvel += (centerOfMass.x - tweep.xpos) / 100;
    tweep.yvel += (centerOfMass.y - tweep.ypos) / 100;
}

function calculateCenterOfMass(TWEEPS) {
    var centerOfMass = {x: 0, y: 0};
    TWEEPS.forEach(function(tweep){
        centerOfMass.x += tweep.xpos;
        centerOfMass.y += tweep.ypos;
    });
    centerOfMass.x /= TWEEPS.length;
    centerOfMass.y /= TWEEPS.length;
    return centerOfMass;
}

function repaint(tweep) {
    $tweep = $(tweep.selector);
    $tweep.offset({
        left: tweep.xpos,
        top: tweep.ypos
    });
}

function gameLoop() {
    TWEEPS.forEach(function(tweep) {
        update(tweep, TWEEPS);
        repaint(tweep);
    });
}

$(function() {
    TWEEPS = [
      new Tweep(100, 100, "#tweep-1"),
      new Tweep(150, 100, "#tweep-2"),
      new Tweep(200, 100, "#tweep-3"),
      new Tweep(200, 150, "#tweep-4"),
      new Tweep(200, 200, "#tweep-5"),
      new Tweep(150, 200, "#tweep-6"),
      new Tweep(100, 200, "#tweep-7"),
      new Tweep(100, 150, "#tweep-8")
    ];

    setInterval(gameLoop, 200);
});