var tweeps;
// Set initial rally point to center of screen before mouse moves
var mousePosition = {x: 800, y: 600};
var scatter = 1.0;

function gameLoop() {
    tweeps.forEach(function(tweep) {
        updateVelocity(tweep);
    });

    reduceScatter();

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
    tweep.xvel += (centerOfMass.x - tweep.xpos) * scatter / 100;
    tweep.yvel += (centerOfMass.y - tweep.ypos) * scatter / 100;
}

function keepAwayFromOthers(tweep) {
    var repulsion = calculateRepulsionVector(tweep);
    tweep.xvel += repulsion.x / 10;
    tweep.yvel += repulsion.y / 10;
}

function matchVelocity(tweep) {
    var averageVelocity = calculateAverageVelocity(tweep);
    tweep.xvel += (averageVelocity.x - tweep.xvel) / 10;
    tweep.yvel += (averageVelocity.y - tweep.xvel) / 10;
}

function attractToMouse(tweep) {
    tweep.xvel += (mousePosition.x - tweep.xpos) * scatter / 200;
    tweep.yvel += (mousePosition.y - tweep.ypos) * scatter / 200;
}

function limitVelocity(tweep) {
    var newVelocity = obeySpeedLimit(5, tweep.xvel, tweep.yvel);
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

function calculateRepulsionVector(tweep) {
    var repulsionVector = {x: 0, y: 0};
    tweeps.forEach(function(otherTweep) {
        if (tweep.distanceFrom(otherTweep) <= 80) {
            repulsionVector.x += tweep.xpos - otherTweep.xpos;
            repulsionVector.y += tweep.ypos - otherTweep.ypos;
        }
    });
    return repulsionVector;
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

function reduceScatter() {
    if(scatter >= 0.6 && scatter < 1) {
        scatter += 0.005;
    } else if (scatter >= 0 && scatter < 0.6) {
        scatter += 0.01;
    } else if(scatter < 0) {
        scatter += 0.05;
    }
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
      new Tweep( 400, 1200, "#tweep-3"),
      new Tweep(1000, 1200, "#tweep-4"),
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

    $(document).on("click", function() {
        scatter = -4;
    });

    setInterval(gameLoop, 25); // 40 fps
});