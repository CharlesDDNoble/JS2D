function rebuildPath(cameFrom, current) {
    var path = [current];
    current = cameFrom.get(current);
    while (current) {
        // prepend
        path.unshift(current);
        current = cameFrom.get(current);
    }
    return path;
}

//An ordered list of all checked locations - useful for visualizing/debugging algorithm
var _astarExploration = [];

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function aStar(start, goal, gameMap, heur) {
    _astarExploration = [];
    let comp = function(x,y) {return (x[1] < y[1]);};// comparator for minheap --> should expose this somehow
    
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known. vvv [index,cost] vvv
    var openSet = new Heap([start.y*gameMap.height+start.x,0],comp); // <== priority queue for estimatedPathCostMap <<<=== change to bin search tree
    
    _astarExploration.push([start.y*gameMap.height+start.x, 0]); 

    // For node n, cameFrom[n] is the node immediately preceding it 
    // on the cheapest path from start to n currently known. <<<<==== uses map2d index
    var cameFrom = new Map();

    // For node n, currentPathCostMap[n] is the cost of the cheapest path from start to n currently known.
    // initialize all values to 0.
    var currentPathCostMap = new Map2D(gameMap.width,gameMap.height,Infinity);
    currentPathCostMap.setDataFromCoords(start.x,start.y,0);

    // For node n, estimatedPathCostMap[n] := currentPathCostMap[n] + h(n,end).
    var estimatedPathCostMap = new Map2D(gameMap.width,gameMap.height);
    estimatedPathCostMap.setDataFromCoords(start.x,start.y,heur(start,goal));

    // map used to check if a given node is already in the open set
    var isInOpenSetMap = new Map2D(gameMap.width,gameMap.height,false);
    isInOpenSetMap.setDataFromCoords(start.x,start.y,true);

    while (openSet.size > 0) {
        var currentIndex = openSet.extract()[0]; //the node in openSet having the lowest estimatedPathCostMap[] value
        isInOpenSetMap.setDataFromIndex(currentIndex,false);
        
        var current = currentPathCostMap.getCoords(currentIndex);
        if (current.x === goal.x && current.y === goal.y) {
            return rebuildPath(cameFrom, currentIndex);
        }

        // list of indexes (NOT COORDS) of neighbors 
        let neighborIndices = currentPathCostMap.getNeighbors(current.x,current.y);

        while (neighborIndices.length > 0) {
            let neighborIndex = neighborIndices.pop();
            let neighborCoords = currentPathCostMap.getCoords(neighborIndex);
            // distance2D(current,neighbor) is the weight of the edge from current to neighbor
            // tentativeCost is the distance from start to the neighbor through current
            var tentativeCost = currentPathCostMap.getDataFromIndex(currentIndex) + heur(current,neighborCoords);
            
            if (tentativeCost < currentPathCostMap.getDataFromIndex(neighborIndex)) {
                _astarExploration.push([neighborIndex, tentativeCost]); //log all explored

                // This path to neighbor is better than any previous one. Record it!
                cameFrom.set(neighborIndex,currentIndex);
                currentPathCostMap.setDataFromIndex(neighborIndex,tentativeCost);
                estimatedPathCostMap.setDataFromIndex(neighborIndex, tentativeCost + heur(neighborCoords,goal));
                
                if (!isInOpenSetMap.getDataFromIndex(neighborIndex,true)) {
                    isInOpenSetMap.setDataFromIndex(neighborIndex,true);
                    openSet.insert([neighborIndex,estimatedPathCostMap.getDataFromIndex(neighborIndex)]);
                }
            }
        }
    }

    // Open set is empty but goal was never reached
    return false;
}