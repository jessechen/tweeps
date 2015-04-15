var tweeps;

function updateVelocity(tweep) {
    attractToCenterOfMass(tweep);
    keepAwayFromOthers(tweep);
}

function attractToCenterOfMass(tweep) {
    var centerOfMass = calculateCenterOfMass(tweeps);
    tweep.xvel += (centerOfMass.x - tweep.xpos) / 100;
    tweep.yvel += (centerOfMass.y - tweep.ypos) / 100;
}

function keepAwayFromOthers(tweep) {
    var xvel = 0;
    var yvel = 0;

    tweeps.forEach(function(otherTweep) {
       if (tweep.distanceFrom(otherTweep) <= 50) {
           xvel = xvel - (otherTweep.xpos - tweep.xpos);
           yvel = yvel - (otherTweep.ypos - tweep.ypos);
       }
    });

    tweep.xvel += xvel;
    tweep.yvel += yvel;
}

function calculateCenterOfMass() {
    var centerOfMass = {x: 0, y: 0};
    tweeps.forEach(function(tweep){
        centerOfMass.x += tweep.xpos;
        centerOfMass.y += tweep.ypos;
    });
    centerOfMass.x /= tweeps.length;
    centerOfMass.y /= tweeps.length;
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
    tweeps.forEach(function(tweep) {
        updateVelocity(tweep, tweeps);
    });

    tweeps.forEach(function(tweep) {
        tweep.updatePosition();
        repaint(tweep);
    });
}

$(function() {
    tweeps = [
      new Tweep(100, 200, "#tweep-1"),
      new Tweep(150, 300, "#tweep-2"),
      new Tweep(200, 400, "#tweep-3"),
      new Tweep(200, 550, "#tweep-4"),
      new Tweep(200, 600, "#tweep-5"),
      new Tweep(150, 700, "#tweep-6"),
      new Tweep(100, 800, "#tweep-7"),
      new Tweep(100, 950, "#tweep-8")
    ];

    setInterval(gameLoop, 200);
});