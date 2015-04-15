var tweeps;

function updateVelocity(tweep) {
    attractToCenterOfMass(tweep);
    keepAwayFromOthers(tweep);
    matchVelocity(tweep);
}

function attractToCenterOfMass(tweep) {
    var centerOfMass = calculateCenterOfMass(tweep);
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

    tweep.xvel += xvel / 4;
    tweep.yvel += yvel / 4;
}

function matchVelocity(tweep) {
    var averageVelocity = calculateAverageVelocity(tweep);
    tweep.xvel += (averageVelocity.x - tweep.xvel) / 8;
    tweep.yvel += (averageVelocity.y - tweep.xvel) / 8;
}

function calculateCenterOfMass(ignoredTweep) {
    var centerOfMass = {x: 0, y: 0};
    tweeps.forEach(function(tweep){
        if(tweep.selector != ignoredTweep.selector) {
            centerOfMass.x += tweep.xpos;
            centerOfMass.y += tweep.ypos;
        }
    });
    centerOfMass.x /= tweeps.length - 1;
    centerOfMass.y /= tweeps.length - 1;
    return centerOfMass;
}

function calculateAverageVelocity(ignoredTweep) {
    var averageVelocity = {x: 0, y: 0};
    tweeps.forEach(function(tweep){
        if(tweep.selector != ignoredTweep.selector) {
            averageVelocity.x += tweep.xvel;
            averageVelocity.y += tweep.yvel;
        }
    });
    averageVelocity.x /= tweeps.length - 1;
    averageVelocity.y /= tweeps.length - 1;
    return averageVelocity;
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
      new Tweep(-100, 200, "#tweep-1"),
      new Tweep(-100, 600, "#tweep-2"),
      new Tweep(-100, 1000, "#tweep-4"),
      new Tweep(400, 1200, "#tweep-3"),
      new Tweep(1600, 800, "#tweep-5"),
      new Tweep(1600, 400, "#tweep-6"),
      new Tweep(200, -100, "#tweep-7"),
      new Tweep(800, -100, "#tweep-8")
    ];

    setInterval(gameLoop, 200);
});