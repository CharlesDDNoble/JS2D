// =============================================================
// Setup
$(document).ready(function() {
    var width = 512;
    var height = 512;
    run("#canvas",width,height);
});

// =============================================================
// Event Handler Functions

function onClick(ctx,event) {

}

function onMousemove(ctx,event) {

}

function onKeydown(ctx,event) {

}

// =============================================================
// Main Drawing functions

var frames = 0;
var steps = 90;

function init(ctx) {

}

function update(ctx) {
    frames++;
    frames%=steps;
}


function draw(ctx) {
    background(ctx,'#e6f3ff',512,512);
    var size = 90;
    for (var i = 0; i < frames+1; i++) {
        font(ctx,'Arial',size-i);
        text(ctx,rgba(255,50,50,.1),'Hello World!',512/2,512/2+i);
    }
}
