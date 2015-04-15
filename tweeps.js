var TWEEPS;

function repaint(tweep) {
    $tweep = $(tweep.selector);
    $tweep.offset({
        left: tweep.xpos,
        top: tweep.ypos
    });
}

function updatePosition(tweep) {
    tweep.xpos += 1;
    tweep.ypos += 1;
}

function gameLoop() {
    console.log(TWEEPS);
    TWEEPS.forEach(function(tweep) {
        updatePosition(tweep);
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