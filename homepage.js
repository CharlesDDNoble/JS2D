// =============================================================
// SETUP

$(document).ready(function() {
    // set up canvas and context for drawing
    var _canvas = $(canvas_id);
    var _ctx = _canvas[0].getContext("2d");
    _canvas.attr("width",canvasWidth);
    _canvas.attr("height",canvasHeight);

    // add event handlers
    _canvas.click(function(event) {on_click(_ctx,event);});
    _canvas.mousemove(function(event) {on_mousemove(_ctx,event);});
    $(document).keydown(function(event) {on_keydown(_ctx,event);});

    init(_ctx);
    main_loop(_ctx);
});

// =============================================================
var canvas_id = "#canvas";
var map;

var padding = 20;
var canvasHeight = 512+padding;
var canvasWidth = 512+padding;
var gridHeight = 512;
var gridWidth = 512;
var tileSize = 32;
var frames = 0;

var exploreCounter =  0;
var pathCounter =  0;
var foundPath;
let start = new Vector2D(0,0);
let goal = new Vector2D(7,7);

var MOUSE_X = 0;
var MOUSE_Y = 0;

function on_mousemove(ctx,event) {
    var _canvas = $(canvas_id)[0];
    let canvasRect = _canvas.getClientRects()[0];
    MOUSE_X = event.pageX-canvasRect.x-padding/2;
    MOUSE_Y = event.pageY-canvasRect.y-padding/2;
}

function on_keydown(ctx,event) {
    console.log('press');
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
    return new Vector2D(new_x/tileSize,new_y/tileSize);
}

function on_click(ctx,event) {
    pathCounter = 0;
    exploreCounter = 0;
    var coords = cleanCoords(MOUSE_X,MOUSE_Y);
    let rockDisInfo = new DisplayInfo('R',"#996633");
    let rock = new Terrain(0,new Vector2D(coords.x,coords.y),rockDisInfo,Infinity,'rock');
    let tile = map.getDataFromCoords(coords.x,coords.y);
    if (tile.objectsContained.length == 0) {
        map.addGameObject(coords.x,coords.y,rock);
    } else {
        tile.clear();
    }
    findPath(start,goal);
}

function aStarHeur(vec1,vec2) {
    let tile = map.getDataFromCoords(vec2.x,vec2.y);
    if (tile.moveCost !== Infinity) {
        // console.log(map.getIndex(vec1.x,vec1.y)+" "+map.getDataFromCoords(vec1.x,vec1.y).isPassable)
        let difx = vec1.x-vec2.x;
        let dify = vec1.y-vec2.y;
        return Math.sqrt(difx*difx + dify*dify);
    } else {
        // console.log("INF!");
        return Infinity;
    }
};

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
}

function init(ctx) {
    _testHeap();

    map = new GameMap(gridHeight/tileSize,gridWidth/tileSize,tileSize,padding/2,padding/2);
    let rockDisInfo = new DisplayInfo('R',"#996633");
    let rock1 = new Terrain(0,new Vector2D(0,1),rockDisInfo,Infinity,'rock');
    let rock6 = new Terrain(1,new Vector2D(1,1),rockDisInfo,Infinity,'rock');
    let rock2 = new Terrain(1,new Vector2D(2,1),rockDisInfo,Infinity,'rock');
    let rock3 = new Terrain(2,new Vector2D(3,1),rockDisInfo,Infinity,'rock');
    let rock4 = new Terrain(3,new Vector2D(4,1),rockDisInfo,Infinity,'rock');
    let rock5 = new Terrain(4,new Vector2D(5,5),rockDisInfo,Infinity,'rock');


    map.addGameObject(rock1.pos.x,rock1.pos.y,rock1);
    map.addGameObject(rock2.pos.x,rock2.pos.y,rock2);
    map.addGameObject(rock3.pos.x,rock3.pos.y,rock3);
    map.addGameObject(rock4.pos.x,rock4.pos.y,rock4);
    map.addGameObject(rock5.pos.x,rock5.pos.y,rock5);
    map.addGameObject(rock6.pos.x,rock6.pos.y,rock5);

    findPath(start,goal);
}

function update(ctx) {
    // animate path
    if (frames%5 === 0) {
        if (exploreCounter < _astarExploration.length) {
            exploreCounter++;
        } else if (pathCounter < foundPath.length) {
            pathCounter++;
        }
    }
    frames++;
}

function draw(ctx) {
    background(ctx,'#e6f3ff',canvasHeight,canvasWidth);
    map.draw(ctx);
    if (foundPath) {
        for (var i = 0; i < exploreCounter; i++) {
            let pair = _astarExploration[i];
            let vec = map.getCoords(pair[0]);
            rectCenter(ctx,'#000000',vec.x*tileSize+padding/2+tileSize/2,vec.y*tileSize+padding/2+tileSize/2,tileSize/8,tileSize/8);
        }
        for (var i = 0; i < pathCounter; i++) {
            let vec = map.getCoords(foundPath[i]);
            cicle(ctx,'#22DD22',vec.x*tileSize+padding/2+tileSize/2,vec.y*tileSize+padding/2+tileSize/2,tileSize/(8));
            cicle(ctx,'#22DD22',vec.x*tileSize+padding/2+tileSize/2,vec.y*tileSize+padding/2+tileSize/2,tileSize/(8));
            // rectCenter(ctx,'#22DD22',vec.x*tileSize+padding/2+tileSize/2,vec.y*tileSize+padding/2+tileSize/2,tileSize/8,tileSize/8);
        }
    }
}
