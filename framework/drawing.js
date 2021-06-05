// =============================================================
// MAIN LIBRARY FUNCTIONS

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mainLoop(ctx) {
    while (true) {
        update(ctx);
        draw(ctx);
        await sleep(17);
    }
}

function run(canvasID) {
    // set up canvas and context for drawing
    var canvas = $(canvasID);
    var ctx = canvas[0].getContext("2d");

    // add event handlers
    $(window).resize(function(event) {onResize(ctx,event);});
    canvas.click(function(event) {onClick(ctx,event);});
    canvas.mousemove(function(event) {onMouseMove(ctx,event);});
    $(document).keydown(function(event) {onKeyDown(ctx,event);});
    $(document).keyup(function(event) {onKeyUp(ctx,event);});
    $(document).keypress(function(event) {onKeyPress(ctx,event);});

    init(ctx);
    mainLoop(ctx);
};

// =============================================================
// DRAWING LIBRARY FUNCTIONS

window.FONT = {
    size: 12,
    style: 'normal',
    family: 'normal',
    serif: 'sans-serif'
}

function rgba(r,g,b,a=1) {
    return `rgba(${r},${g},${b},${a})`;
}

function font(ctx, size=null, style=null, family=null, serif=null) {
    if (style !== null) {
        FONT.style = style;
    }
    if (family !== null) {
        FONT.family = family;
    }
    if (serif !== null) {
        FONT.serif = serif;
    }
    if (size !== null) {
        FONT.size = size;
    }
    fontString = `${FONT.style} ${FONT.size}px ${FONT.family}, ${FONT.serif}`;
    ctx.font = fontString;
    // console.log(fontString);
}

// default center
function text(ctx,color,text,x,y,isFilled=true,align='center') {
    // var aligns = ["center", "end", "left", "right", "start"];
    ctx.textAlign = align;
    textMetric = ctx.measureText(text);
    // translate from the center of the text box to top-left corner
    if (align != 'center') {
        x += textMetric.actualBoundingBoxLeft;
        y += textMetric.actualBoundingBoxAscent;
        // y += textMetric.actualBoundingBoxAscent 
        //      + textMetric.actualBoundingBoxDescent;
    }
    if (isFilled) {
        ctx.fillStyle = color;
        ctx.fillText(text,x,y);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeText(text,x,y);
    }
}

function rect(ctx,color,x,y,width,height,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        ctx.fillStyle = color;
        ctx.fillRect(x,y,width,height);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, width,height);
    }
}

function rectCenter(ctx,color,x,y,width,height,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        ctx.fillStyle = color;
        ctx.fillRect(x-width/2,y-height/2,width,height);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(x-width/2, y-height/2, width,height);
    }
}

function cicle(ctx,color,x,y,radius,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function background(ctx,color,height,width) {
    // background
    ctx.fillStyle = color;
    ctx.fillRect(0,0,height,width);
}

function getImage(path,width,height) {
    var image = new Image(width,height);
    image.src = path;
    return image;
}

/* Needs to be tested */
function gradient(r1,g1,b1,a1,r2,g2,b2,a2,steps) {
    var colors = [];

    for (var i = 0; i < steps; i++) {
        var r_dif = (r2-r1)/steps;
        var g_dif = (g2-g1)/steps;
        var d_dif = (b2-b1)/steps;
        var a_dif = (a2-a1)/steps;
        colors.push(
            rgba(r1+(r_dif*i),
                b1+(b_dif*i),
                d1+(d_dif*i),
                a1+(a_dif*i))
        );
    }

    return colors;
}

function resizeCanvas(canvas) {

}