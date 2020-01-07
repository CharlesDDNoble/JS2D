// =============================================================
// LIBRARY FUNCTIONS

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main_loop(ctx) {
    while (true) {
        update(ctx);
        draw(ctx);
        await sleep(17);
    }
}

// =============================================================
// DRAWING FUNCTIONS


function fill_color(ctx,color) {
    ctx.fillStyle = color;
}

function stroke_color(ctx,color) {
    ctx.strokeStyle = color;
}

function rect(ctx,color,x,y,width,height,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        fill_color(ctx,color);
        ctx.fillRect(x,y,width,height);
    } else {
        stroke_color(ctx,color);
        ctx.strokeRect(x, y, width,height);
    }
}

function rectCenter(ctx,color,x,y,width,height,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        fill_color(ctx,color);
        ctx.fillRect(x-width/2,y-height/2,width,height);
    } else {
        stroke_color(ctx,color);
        ctx.strokeRect(x-width/2, y-height/2, width,height);
    }
}

function cicle(ctx,color,x,y,radius,isFilled=true,lineWeight=10) {
    ctx.lineWidth = lineWeight;
    if (isFilled) {
        fill_color(ctx,color);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        stroke_color(ctx,color);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function background(ctx,color,canvas_height,canvas_width) {
    // background
    fill_color(ctx,color);
    ctx.fillRect(0,0,canvas_height,canvas_width);
}

function get_image(path,width,height) {
    var image = new Image(width,height);
    image.src = path;
    return image;
}
