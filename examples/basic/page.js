// =============================================================
// Setup
$(document).ready(function() {
    var width = $(window).width();
    var height = $(window).height();
    run("#canvas",width,height);
});

// =============================================================
// Event Handler Functions

function onClick(ctx,event) {

}

function onMouseMove(ctx,event) {

}

function onKeyDown(ctx,event) {

}

function onKeyUp(ctx,event) {

}

function onResize(ctx,event) {
    var width = $(window).width();
    var height = $(window).height();
    var size = findBestSize(width, height);
    $("#canvas").prop({
        width: size,
        height: size
    });
    $("#canvas").prop({
        width: size,
        height: size
    });
}

// =============================================================
// Main Drawing functions

var frames = 0;
var steps = 90;

function findBestSize(width, height) {
    var min = Math.min(width, height);
    var wh = 64;
    for (var i = 64; i <= 1024; i+=64) {
        if (i < min) {
            wh = i;
        }
    }
    return wh;
}

function init(ctx) {
    var width = $(window).width();
    var height = $(window).height();
    onResize(ctx, null);
}

function update(ctx) {
    var width = $("#canvas").width();
    steps = Math.ceil(width * 0.17);
    frames++;
    frames %= steps;
}


function draw(ctx) {
    var canv = $("#canvas");
    var width = canv.width();
    var height = canv.height();
    background(ctx,"#c11ccc",width,height);
    rect(ctx, "#120877", 0, 0, width, height / 4, true, 10);
    rect(ctx, "#120877", 0, height  * (3 / 4), width, height, true, 10);
    for (var i = 0; i < frames; i++) {
        font(ctx,i,null,'Arial',);
        text(ctx,
            rgba(128 + i, 50 + i, 50, 0.1 + (i / 10)),
            'Hello World!',
            width / 2,
            height / 2 - (i / 2) + (height / 15),
            true,
            'center');
    }
}
