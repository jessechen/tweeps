var tweeps;
// Set initial rally point to center of screen before mouse moves
var mousePosition = {x: 800, y: 600};

function gameLoop() {
    tweeps.forEach(function(tweep) {
        updateVelocity(tweep);
    });

    tweeps.forEach(function(tweep) {
        tweep.updatePosition();
        repaint(tweep);
    });
}

function updateVelocity(tweep) {
    attractToCenterOfMass(tweep);
    keepAwayFromOthers(tweep);
    matchVelocity(tweep);
    attractToMouse(tweep);
    limitVelocity(tweep);
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
       if (tweep.distanceFrom(otherTweep) <= 100) {
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

function attractToMouse(tweep) {
    var xdelta = mousePosition.x - tweep.xpos;
    var ydelta = mousePosition.y - tweep.ypos;

    tweep.xvel += xdelta / 20;
    tweep.yvel += ydelta / 20;
}

function limitVelocity(tweep) {
    var newVelocity = obeySpeedLimit(4, tweep.xvel, tweep.yvel);

    tweep.xvel = newVelocity.x;
    tweep.yvel = newVelocity.y;
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

function obeySpeedLimit(speedLimit, x, y) {
    var magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if(magnitude > speedLimit) {
        x /= (magnitude / speedLimit);
        y /= (magnitude / speedLimit);
    }
    return {x: x, y: y};
}

function repaint(tweep) {
    $tweep = $(tweep.selector);
    $tweep.offset({
        left: tweep.xpos,
        top: tweep.ypos
    });
}

$(function() {
    // Move tweeps offscreen before making them visible so there's no brief flash of visibility
    tweeps = [
      new Tweep(-100,  200, "#tweep-1"),
      new Tweep(-100,  600, "#tweep-2"),
      new Tweep(-100, 1000, "#tweep-3"),
      new Tweep( 400, 1200, "#tweep-4"),
      new Tweep(1600,  800, "#tweep-5"),
      new Tweep(1600,  400, "#tweep-6"),
      new Tweep( 200, -100, "#tweep-7"),
      new Tweep( 800, -100, "#tweep-8")
    ];

    gameLoop();
    $(".tweep").show();

    $(document).on("mousemove", function(evt) {
        mousePosition.x = evt.pageX;
        mousePosition.y = evt.pageY;
    });

    setInterval(gameLoop, 50);
});