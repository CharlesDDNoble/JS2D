class Vector2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class IDManager {
    constructor(ids=[]) {
        this.ids = ids;
    }
}

class DisplayInfo {
    constructor(symbol,color) {
        this.symbol = symbol;
        this.color = color;
    }
    //char symbol
    //int color
}

class GameObject {
    //int moveCost - extra cost of moving through a square with this object 
    //             - 1 is base, 1.1 cost 10% more than base. Infinity for impassable.
    constructor(id=null,pos=null,disInfo=null,moveCost=1) {
        this.id = id;
        this.pos = pos;
        this.disInfo = disInfo;
        this.moveCost = moveCost;
    }
}

class Terrain extends GameObject {
    constructor(id,pos,disInfo,moveCost,type) {
        super(id,pos,disInfo,moveCost);
        this.type = type;
    }
}

class StatBlock {
    constructor(hp,dmg,atk_spd,atk_cd) {
        this.hp = hp;
        this.dmg = dmg;
        this.atk_spd = atk_spd;
        this.atk_cd = atk_cd;
    }
    // int hp
    // int dmg
    // int atk_spd
    // int atk_cd
}

class Action {
    constructor() {}
    execute() {
        throw "Must implement this function";
    }

}

class Attack extends Action {
    constructor(targetID) {
        this.targetID = targetID;
    }
    execute() {
        // ...
    }
}

class Move extends Action {
    // Vector2D targetLocation
    constructor(targetLocation) {
        this.targetLocation = targetLocation;
    }
    execute() {
        // ...
    }
}

class Build extends Action {
    // int targetItemID
    // Vector2D targetLocation
    constructor(targetItemID,targetLocation) {
        this.targetItemID = targetItemID;
        this.targetLocation = targetLocation;
    }
    execute() {
        // ...
    }
}

class Unit extends GameObject {
    // Map *map
    // Action currentAction
    // int team
    // StatBlock stats
    constructor(map,currentAction,team,stats) {
        this.map = map;
        this.currentAction = currentAction;
        this.team = team;
        this.stats = stats;
    }
}

class Map2D {
    constructor(width,height,initialValue=undefined) {
        this.grid = new Array(height*width);
        this.width = width;
        this.height = height;
        if (initialValue !== undefined) {
            for (var i = 0; i < width*height; i++) {
                this.grid[i] = initialValue;
            }
        }
    }

    toJSON() {
        var tiles = [];
        for (var i = 0; i < this.grid.length; i++) {
            delete this.grid[i].map;
            tiles.push(JSON.stringify(this.grid[i]));
        }
        return tiles;
    }

    distance(x1,y1,x2,y2) {
        x_dif = x1-x2;
        y_dif = y1-y2;
        return sqrt(x_dif*x_dif + y_dif*y_dif);
    }

    setDataFromCoords(x,y,data) {
        this.grid[this.getIndex(x,y)] = data;
    }

    setDataFromIndex(index,data) {
        this.grid[index] = data;
    }

    getDataFromIndex(index) {
        return this.grid[index];
    }

    getDataFromCoords(x,y) {
        return this.grid[this.getIndex(x,y)];
    }

    getIndex(x,y) {
        return y*this.height + x;
    }

    getCoords(index) {
        let x = index%this.height;
        let y = (index/this.height>>0); // fast integer division
        return new Vector2D(x,y);
    }

    getNeighbors(x,y) {
        var neighbors = [];
        
        if (x - 1 >= 0) {
            neighbors.push(this.getIndex(x-1,y));
        }
        if (x + 1 < this.width) {
            neighbors.push(this.getIndex(x+1,y));
        }
        if (y - 1 >= 0) {
            neighbors.push(this.getIndex(x,y-1));
        }
        if (y + 1 < this.height) {
            neighbors.push(this.getIndex(x,y+1));
        }
        return neighbors;
    }
}

class Tile {
    // Vector2D pos
    // List* lastDisplayed
    // List[IDHolder] objectsContained
    // OPTION - separate unit and terrain list
    constructor(x,y,map) {
        this.pos = new Vector2D(x,y);
        this.map = map;
        this.lastIndexDisplayed = 0;
        this.moveCost = 1;
        this.objectsContained = []; //make this a binary tree
    }

    addGameObject(gameObj) {
        this.moveCost = Math.max(this.moveCost, gameObj.moveCost);
        this.objectsContained.push(gameObj);
    }

    removeGameObject(gameObj) {
        // need to update lastIndexDisplayed
        let hasFoundObj = false;
        
        for (var i = 0; i < this.objectsContained.length; i++) {
            let curID = this.objectsContained[i].id;
            if (gameObj.id === curID) {
                hasFoundObj = true;
                this.objectsContained.splice(i,1);
                break;
            }
        }

        // check for updated moveCost
        if (gameObj.moveCost === this.moveCost) {
            for (var i = 0; i < this.objectsContained.length; i++) {
                this.moveCost = Math.max(this.moveCost, this.objectsContained[i].moveCost);
            }
        }

        if (!hasFoundObj) {
            throw "Tile could not find object to remove!";
        }
    }

    clear() {
        this.lastIndexDisplayed = 0;
        this.moveCost = 1;
        this.objectsContained = [];
    }

    draw(ctx) {
        let x1 = this.pos.x*this.map.tileSize+this.map.leftPadding;
        let y1 = this.pos.y*this.map.tileSize+this.map.upperPadding;
        // draw tile
        rect(ctx,
            '#ffccb3',
            x1,
            y1,
            this.map.tileSize,
            this.map.tileSize);

        // draw an object on the tile
        let count = this.objectsContained.length;
        if (count > 0) {
            // handle multiple objects
            let index = this.lastIndexDisplayed+1%count;
            let obj = this.objectsContained[index];
            rectCenter(ctx,obj.disInfo.color,x1+this.map.tileSize/2,y1+this.map.tileSize/2,this.map.tileSize/2,this.map.tileSize/2);
        }

        // draw outline
        rect(ctx,
            '#ffaa80',
            x1,
            y1,
            this.map.tileSize,
            this.map.tileSize,
            false,
            4);
    }
}

class GameMap extends Map2D {
    constructor(width,height,tileSize,leftPadding=0,upperPadding=0) {
        super(width,height);
        this.leftPadding = leftPadding;
        this.upperPadding = upperPadding;
        this.tileSize = tileSize;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var tile = new Tile(x,y,this);
                this.setDataFromCoords(x,y,tile);
            }
        }
    }

    addGameObject(x,y,gameObj) {
        let index = this.getIndex(x,y);
        this.grid[index].addGameObject(gameObj);
    }

    removeGameObject(x,y,gameObj) {
        let index = this.getIndex(x,y); 
        this.grid[index].removeGameObject(gameObj);
    }

    update() {
        // for (var y = 0; y < height; y++) {
        //     for (var x = 0; x < width; x++) {
        //         this.setDataFromCoords(x,y,tile);
        //     }
        // }
    }

    draw(ctx) {
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i].draw(ctx);
        }
    }
}
