// =============================================================
// Setup

$(document).ready(function() {
    var width = $(window).width();
    var height = $(window).height();
    run("#canvas");
});

// =============================================================
// Event Handler Functions

function onMouseMove(ctx,event) {
    var _canvas = $('#canvas')[0];
    let canvasRect = _canvas.getClientRects()[0];
    MOUSE_X = event.pageX-canvasRect.x;
    MOUSE_Y = event.pageY-canvasRect.y;
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
    if (map != null) {
        map.tileSize = size/16;
    }
    tileSize = size/16;
}

function onClick(ctx,event) {
    pathCounter = 0;
    exploreCounter = 0;
    var coords = cleanCoords(MOUSE_X,MOUSE_Y);
    let rock = createRock(coords.x,coords.y);
    let tile = map.getDataFromCoords(coords.x,coords.y);
    if (tile.objectsContained.length == 0) {
        map.addGameObject(coords.x,coords.y,rock);
    } else {
        tile.clear();
    }
    findPath(start,goal);
}

// =============================================================
// Main Drawing functions


var map = null;

var frames = 0;
var tileSize = 16;
var exploreCounter =  0;
var pathCounter =  0;
var foundPath;
let start = new Vector2D(0,0);
let goal = new Vector2D(7,7);

var MOUSE_X = 0;
var MOUSE_Y = 0;

var pathCostColors = [];

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

function cleanCoords(x,y) {
    var new_x = 0;
    var new_y = 0;

    while (x > new_x+tileSize) {
        new_x += tileSize;
    }
    while (y > new_y+tileSize) {
        new_y += tileSize;
    }
    return new Vector2D(new_x / tileSize, new_y / tileSize);
}

function createRock(x,y) {
    return new Terrain(0,
        new Vector2D(x,y),
        new DisplayInfo('R',"#996633"),
            Infinity,
            'rock'); 
}

function aStarHeur(vec1,vec2) {
    let tile = map.getDataFromCoords(vec2.x, vec2.y);
    if (tile.moveCost !== Infinity) {
        let difx = vec1.x - vec2.x;
        let dify = vec1.y - vec2.y;
        return Math.sqrt(difx * difx + dify * dify);
    } else {
        return Infinity;
    }
};

function createColorArray() {
    var numOfSteps = 20;
    var min = Infinity;
    var max = 0;

    // find the max and min cost paths
    for (var i = _astarExploration.length - 1; i >= 0; i--) {
        var cost = _astarExploration[i][1];
        max = Math.max(max,cost);
        min = Math.min(min,cost);
    }
    var step = (max-min)/numOfSteps;

    // red to green gradient
    var gradient = [];
    for (var i = 0; i < numOfSteps; i++) {
        var r = 255-(i*(255/numOfSteps));
        var g = (i*(255/numOfSteps));
        var color = rgba(r,g,0,1);
        gradient.push(color);

    }

    var colors = [];

    // map all points to a specific color based on their cost
    for (var i = 0; i < _astarExploration.length; i++) {
        // how many steps from the smallest cost path is this
        var index = Math.floor((_astarExploration[i][1]-min)/step);
        colors.push(gradient[index]);
    }

    return colors;
}

function findPath(start,goal) {
    // astar testing
    var start_time = performance.now();

    foundPath = aStar(start,goal,map,aStarHeur);
    if (foundPath) {
        foundPath.unshift(map.getIndex(start.x,start.y)); // path doesnt include start by default
    }

    var elapsed_time = performance.now() - start_time;
    
    console.log(`Path: ${foundPath}`);
    console.log(`Found in ${elapsed_time} ms`);

    pathCostColors = createColorArray();

    return elapsed_time;
}


function init(ctx) {
    onResize(ctx, null);
    var canv = $("canvas");
    var width = canv.width();
    var height = canv.height();
    tileSize = canv.height()/16;
    
    map = new GameMap(16,
                16,
                height / 16,
                0,
                0);

    var allTerrain = [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[8,1],
                      [9,1],[10,1],[11,1],[12,1],[13,2],[1,3],[2,3],[3,3],
                      [4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],
                      [14,3],[2,4],[6,4],[12,4],[4,5],[8,5],[0,6],[2,6],
                      [3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
                      [12,6],[13,6],[14,6],[15,6],[6,7],[8,7],[9,7],[2,8],
                      [3,8],[4,8],[6,8],[8,8],[9,8],[10,8],[11,8],[12,8],
                      [13,8],[14,8],[2,9],[6,9],[14,9],[2,10],[4,10],[5,10],
                      [6,10],[7,10],[8,10],[9,10],[10,10],[11,10],[14,10],
                      [2,11],[14,11],[1,12],[2,12],[3,12],[4,12],[5,12],
                      [6,12],[8,12],[11,12],[14,12],[8,13],[12,13],[14,13],
                      [0,14],[1,14],[3,14],[4,14],[5,14],[6,14],[8,14],
                      [13,14],[8,15]];

    for (var i = 0; i < allTerrain.length; i++) {
        let x = allTerrain[i][0];
        let y = allTerrain[i][1];
        map.addGameObject(x,y,createRock(x,y));
    }
    findPath(start,goal);
}

function update(ctx) {
    // animate path
    if (frames%3 === 0) {
        if (exploreCounter < _astarExploration.length) {
            exploreCounter++;
        } else if (pathCounter < foundPath.length) {
            pathCounter++;
        }
    }
    frames++;
}


function drawExplored(ctx) {
    for (var i = 0; i < exploreCounter; i++) {
        let pair = _astarExploration[i];
        let vec = map.getCoords(pair[0]);
        rectCenter(ctx,
            pathCostColors[i],
            vec.x*tileSize+tileSize/2,
            vec.y*tileSize+tileSize/2,
            tileSize/4,
            tileSize/4);
    }
}

function drawFoundPath(ctx) {
    for (var i = 0; i < pathCounter; i++) {
        let vec = map.getCoords(foundPath[i]);
        cicle(ctx,
            '#000000',
            vec.x*tileSize+tileSize/2,
            vec.y*tileSize+tileSize/2,
            tileSize/6);
        cicle(ctx,
            '#22FF22',
            vec.x*tileSize+tileSize/2,
            vec.y*tileSize+tileSize/2,
            tileSize/7);
    }
}

function draw(ctx) {
    var canv = $("canvas")
    var width = canv.width();
    var height = canv.height();
    background(ctx,'#e6f3ff',width,height);
    map.draw(ctx);
    tileSize = canv.width()/16;

    // draw start rect
    rectCenter(ctx,
        '#FF2200',
        start.x*tileSize+tileSize/2,
        start.y*tileSize+tileSize/2,
        tileSize,
        tileSize);
    
    // draw goal rect
    rectCenter(ctx,
        '#44DD22',
        goal.x*tileSize+tileSize/2,
        goal.y*tileSize+tileSize/2,
        tileSize,
        tileSize);

    if (foundPath) {
        drawExplored(ctx);
        drawFoundPath(ctx);
    }
}
