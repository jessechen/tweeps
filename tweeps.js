function redraw($tweep) {
    $tweep.offset({
        top: $tweep.data("top"),
        left: $tweep.data("left")
    });
}

function updatePosition($tweep) {
    $tweep.data("top", $tweep.data("top") + 1);
    $tweep.data("left", $tweep.data("left") + 1);
}

$(function() {
    setInterval(function() {
        var $tweeps = $(".tweep");
        $tweeps.each(function() {
            $tweep = $(this);
            updatePosition($tweep);
            redraw($tweep);
        });
    }, 50);
});