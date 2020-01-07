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

function inOpenSet(data,openSet,updatedValue) {
    if (openSet === null) {
        return false;
    } else if (openSet.data === null) {
        return false;
    } else if (openSet.data[0] === data[0]) {
        openSet.data[1] = updatedValue;
        return true;
    } else if (openSet.comparator(data,openSet.data)) {
        return inOpenSet(data,openSet.getLeftChild()) || inOpenSet(data,openSet.getRightChild());
    } else {
        return false;
    }
}

var _astarExploration = [];

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function aStar(start, goal, gameMap, heur) {
    _astarExploration = [];

    let comp = function(x,y) { return (x[1] < y[1]); };// comparator for minheap
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    var openSet = new Heap([start.y*gameMap.height+start.x,0],comp); // <== priority queue for estimatedPathCostMap <<<=== change to bin search tree
    _astarExploration.push([start.y*gameMap.height+start.x, 0]); //log all explored

    // For node n, cameFrom[n] is the node immediately preceding it 
    // on the cheapest path from start to n currently known. <<<<==== uses map2d index
    var cameFrom = new Map();

    // For node n, currentPathCostMap[n] is the cost of the cheapest path from start to n currently known.
    var currentPathCostMap = new Map2D(gameMap.width,gameMap.height,Infinity);
    currentPathCostMap.setDataFromCoords(start.x,start.y,0);

    // For node n, estimatedPathCostMap[n] := currentPathCostMap[n] + h(n,end).
    var estimatedPathCostMap = new Map2D(gameMap.width,gameMap.height);
    estimatedPathCostMap.setDataFromCoords(start.x,start.y,heur(start,goal));
    

    while (openSet.size > 0) {
        var currentIndex = openSet.peek()[0]; //the node in openSet having the lowest estimatedPathCostMap[] value
        
        // _astarExploration.push([currentIndex,'visited', 0]); //log all explored

        var current = currentPathCostMap.getCoords(currentIndex);
        if (current.x === goal.x && current.y === goal.y) {
            return rebuildPath(cameFrom, currentIndex);
        }
        openSet.extract();
        // list of indexes (NOT COORDS) of neighbors 
        let neighborIndices = currentPathCostMap.getNeighbors(current.x,current.y);

        while (neighborIndices.length > 0) {
            let neighborIndex = neighborIndices.pop();
            let neighborCoords = currentPathCostMap.getCoords(neighborIndex);
            // distance2D(current,neighbor) is the weight of the edge from current to neighbor
            // tentativeCost is the distance from start to the neighbor through current
            tentativeCost = currentPathCostMap.getDataFromIndex(currentIndex) + heur(current,neighborCoords);
            if (currentPathCostMap.getDataFromIndex(neighborIndex) === undefined) {
                currentPathCostMap.setDataFromIndex(neighborIndex,Infinity);
            }
            if (tentativeCost < currentPathCostMap.getDataFromIndex(neighborIndex)) {
                _astarExploration.push([neighborIndex, tentativeCost]); //log all explored
                // This path to neighbor is better than any previous one. Record it!
                cameFrom.set(neighborIndex,currentIndex);
                currentPathCostMap.setDataFromIndex(neighborIndex,tentativeCost);
                estimatedPathCostMap.setDataFromIndex(neighborIndex, tentativeCost + heur(neighborCoords,goal));
                if (!inOpenSet(neighborIndex,openSet,tentativeCost)) {
                    openSet.insert([neighborIndex,estimatedPathCostMap.getDataFromIndex(neighborIndex)]);
                }
            }
        }
    }

    // Open set is empty but goal was never reached
    return false;
}