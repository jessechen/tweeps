
// BOID ANTS by Jonathon Crane
// Based on Pseudocode and great explanation by Conrad Parker.
// Find it at: http://www.vergenet.net/~conrad/boids/pseudocode.html

// Version 01 got Ants to flock.
// Version 02 got Ants to flock and follow mouse.
// Version 03 I changed the parameters a bit, but I like 02 better.
// Version 04 got ants to go to center a bit more. Also they scatter
// from the mouse when you click it.
// Modified by Conrad Parker Mar 27 2001:
//     * fixed bug in distance calculation (rule 2)
//     * tweaked parameters to simulate smoothly flying things with
//       less rigid flocking behaviour


// Vars for this application
// Shorcuts to access the images of ants in different directions
var dir = "/~conrad/images/ants/";
var directions = new Array(
    "n", "ne", "e", "se", "s", "sw", "w", "nw"
);

var clock = 0;
var nVisible = 0;

var initialWidth, initialHeight;

function getAntImageFileName(antDirection) {
    return (dir + "ant-" + antDirection + ".gif");
}


//-----------------------------------------------------------------------------
// Real process code
//-----------------------------------------------------------------------------

var ants = new Array();

function initAnts() {

    var i, layer;

    // Set these variables so we can stop the NS resizing bug
    if (isMinNS4) {
        origWidth = innerWidth;
        origHeight = innerHeight;
    }

    initialWidth = document.width;
    initialHeight = document.height;

    // Get handles to all the ant layers.

    i = 0;
    while ((layer = getLayer("ant" + (i + 1))) != null) {
        ants[i] = layer;
        if (isMinNS4) // This step may well be the same as preloading the imgs
            ants[i].image = ants[i].document.images["antImg" + (i + 1)];
        if (isMinIE4 || NS6)
            ants[i].image = document.images["antImg" + (i + 1)];
        // Set initial position
        setAnt(i);
        // Set initial velocity
        ants[i].velocityX = 1;
        ants[i].velocityY = 0;
        ants[i].perching = 1;
        ants[i].perchTimer = 220 + i * 10;
        showLayer(ants[i]);
        nVisible++;
        //showAntDir(i, "s");
        i++;
    }
    updateAnts();
}

function setAnt(n) {
    var s, x, y;

    y = (n+1) * ((getWindowHeight()-22) / 8);
    x = 6;

    moveLayerTo(ants[n], x, y);
}

function showAntDir(antNum, dirName) {
    if (isMinNS4 || isMinIE4 || NS6) {
        // Just need to change the image of this ant
        ants[antNum].image.src = getAntImageFileName(dirName);
    }
}

var gRule1Scale = 1.0;

function rule1(thisAnt) {
    // Calculate the percieved center of the flock from
    // the perspective of thisAnt.
    var i, cX, cY, dx, dy;
    var sumX = 0;
    var sumY = 0;
    var nAnts = 0;

    // Go through each and and add the mass except thisAnt
    for (i = 0; i < ants.length; i++) {
        if ((i != thisAnt) && isVisible (ants[i])) {
            sumX += getLeft(ants[i]);
            sumY += getTop(ants[i]);
            nAnts ++;
        }
    }

    if (nAnts < 1) return;

    // Take the mean
    cX = sumX / nAnts;
    cY = sumY / nAnts;

    // Now calculate the offset to move the ant closer
    dx = (cX - getLeft(ants[thisAnt]))/100;
    dy = (cY - getTop(ants[thisAnt]))/100;

    // Add this velocity on
    ants[thisAnt].velocityX += dx;
    ants[thisAnt].velocityY += dy;
}

var sx, sy;

function rule2(thisAnt) {
    // Keep this ant away from other ants
    var i;
    var sX = 0;
    var sY = 0;

    for (i = 0; i < ants.length; i++) {
        if ((i != thisAnt) && isVisible (ants[i])) {
            if (tooClose(thisAnt, i)) {
                sX = sX + sx;
                sY = sY + sy;
            }
        }
    }
    // Add this velocity on
    ants[thisAnt].velocityX += sX;
    ants[thisAnt].velocityY += sY;
}

function tooClose(ant1, ant2) {
    // Will return true if ant1 is too close to ant2
    var dx, dy, d, ux, uy, scale;
    dx = getLeft(ants[ant1]) - getLeft(ants[ant2]);
    dy = getTop(ants[ant1]) - getTop(ants[ant2]);
    // Get hypotenuse of triangle
    d = Math.sqrt(dx*dx + dy*dy);
    if ((d < 40) && (d != 0)) {
        sx = dx/4;
        sy = dy/4;
        return true;
    } else {
        return false;
    }
}

function rule3(thisAnt) {
    // Match velocity with other nearby ants
    //window.status = ants[thisAnt].velocityY;
    // Calculate the percieved velocity of the flock
    var i, cX, cY, dx, dy;
    var sumX = 0;
    var sumY = 0;
    var nAnts = 0;

    // Go through each and and add the velocity except thisAnt
    for (i = 0; i < ants.length; i++) {
        if ((i != thisAnt) && isVisible (ants[i])) {
            sumX += ants[i].velocityX;
            sumY += ants[i].velocityY;
            nAnts ++;
        }
    }

    if (nAnts < 1) return;

    // Take the mean
    cX = sumX / nAnts;
    cY = sumY / nAnts;

    // Now calculate the offset to move the ant closer
    dx = (cX - ants[thisAnt].velocityX)/8;
    dy = (cY - ants[thisAnt].velocityY)/8;

    // Add this velocity on
    ants[thisAnt].velocityX += dx;
    ants[thisAnt].velocityY += dy;

}

function limitVelocity(thisAnt) {
    // put the velocity within bounds so that ants
    // never go to fast
    var vx, vy, magV;
    var cVelocityLimit = 24; // Ants don't move more than this many pixels in a time step
    vx = ants[thisAnt].velocityX;
    vy = ants[thisAnt].velocityY;
    magV = Math.sqrt(vx*vx + vy*vy);
    if (magV > cVelocityLimit) {
        ants[thisAnt].velocityX = (vx / magV) * cVelocityLimit;
        ants[thisAnt].velocityY = (vy / magV) * cVelocityLimit;
    }
}

function tendToMouse(thisAnt) {
    // Guide the ant toward the current mouse pointer
    var dx, dy;

    // Calculate the offset to move the ant closer
    dx = (mouseX - getLeft(ants[thisAnt]))/200;
    dy = (mouseY - getTop(ants[thisAnt]))/200;

    // Scale this vector by a value determined by the mouse click
    // before adding it.
    dx = gRule1Scale * dx;
    dy = gRule1Scale * dy;

    // Add this velocity on
    ants[thisAnt].velocityX += dx;
    ants[thisAnt].velocityY += dy;
}

function boundPosition(thisAnt) {
    var boundBuffer = 20;
    var xMax = initialWidth - boundBuffer;
    var xMin = boundBuffer;
    var yMax = initialHeight - boundBuffer;
    var yMin = boundBuffer;
    var boundFactor = 10;

    ax = getLeft(ants[thisAnt]);
    ay = getTop(ants[thisAnt]);
    vx = ants[thisAnt].velocityX;
    vy = ants[thisAnt].velocityY;

    // Bound X
    if (ax < xMin) {
        vx = vx + boundFactor;
    } else if (ax > xMax) {
        vx = vx - boundFactor;
    }
    // Bound Y
    if (ay < 0) {
        moveLayerTo(ants[thisAnt], ax, 0);
        ants[thisAnt].perching = 1;
        ants[thisAnt].perchTimer = 30 + Math.floor(Math.random(20));
        vy = 1;
        vx = 0;
    } else if (ay < yMin) {
        vy = vy + boundFactor;
        //moveLayerTo(ants[thisAnt], ax, 0);
        //vy = 0;
    } else if (ay > yMax) {
        vy = vy - boundFactor;
    }
    // Assign velocites
    ants[thisAnt].velocityX = vx;
    ants[thisAnt].velocityY = vy;
}

function onScreen(thisAnt) {
    ax = getLeft (ants[thisAnt]);
    ay = getTop (ants[thisAnt]);

    if (ax < -22) return false;
    if (ax > initialWidth) return false;
    if (ay < -22) return false;
    if (ay > initialHeight) return false;

    return true;
}

function updateAnts() {

    var i, dx, dy, theta, d;

    // Move each ant toward the mouse pointer, if she hits it, drop her back onto
    // the page randomly.
    d = 3;

    // If the rule1 scale is anything other than 1.0, gradually scale
    // it back so it is.
    if (gRule1Scale > 1)
        gRule1Scale = gRule1Scale - 0.1;
    else if (gRule1Scale < 1)
        gRule1Scale = gRule1Scale + (1 - gRule1Scale)*0.2;


    for (i = 0; i < ants.length; i++) {

        if (ants[i].perching == 1) {
            if (ants[i].perchTimer > 0) {
                ants[i].perchTimer = ants[i].perchTimer - 1;
            } else {
                ants[i].perchTimer == 0;
                ants[i].perching = 0;
            }
        } else if (isVisible(ants[i]) && (clock > 600) && (onScreen(i) == false)) {
            hideLayer (ants[i]);
            nVisible--;
        } else if (isVisible(ants[i])) {

            // Apply the flocking rules to determine velocity
            rule1(i); // Go towards center of flock
            rule2(i); // Don't hit other birds
            rule3(i); // Match velocity.
            limitVelocity(i);

            if (clock < 300) {
                ants[i].velocityY -= 2;
            }

            if (clock > 600) {
                ants[i].velocityX -= 3;
                ants[i].velocityY += 3;
            } else {
                tendToMouse(i); // Steer the ants toward the mouse pointer
                boundPosition(i); // Keep em locked in
            }

            // The ants move one step of the velocity per time step.
            dx = ants[i].velocityX;
            dy = ants[i].velocityY;

            // Move the ant by this amount
            moveLayerBy(ants[i], dx, dy);

            // Calculate the direction from velocity
            theta = Math.round(Math.atan2(-dy, dx) * 180 / Math.PI);
            if (theta < 0)
                theta += 360;

            if (theta > 23 && theta <= 68) {
                showAntDir(i, "ne");
            }
            else if (theta > 68 && theta <= 113) {
                showAntDir(i, "n");
            }
            else if (theta > 113 && theta <= 158) {
                showAntDir(i, "nw");
            }
            else if (theta > 158 && theta <= 203) {
                showAntDir(i, "w");
            }
            else if (theta > 203 && theta <= 248) {
                showAntDir(i, "sw");
            }
            else if (theta > 248 && theta <= 293) {
                showAntDir(i, "s");
            }
            else if (theta > 293 && theta <= 338) {
                showAntDir(i, "se");
            }
            else {
                showAntDir(i, "e");
            }
        }

    }

    if (nVisible > 0) {
        // Set up next call.
        setTimeout('updateAnts()', 60);
    }

    clock++;

    return;
}

