
class Tree {
    constructor(data,parent=null) {
        this.data = data;
        this.parent = parent;
        this.children = [];
        this.size = 1;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    isLeaf() {
        return this.children.length;
    }

    addChild(data,isTree=false) {
        var child = null; 
        if (isTree) {
            child = data;
        } else {
            child = new Tree(data,parent);
        }
        this.children.push(child);
        this.size += child.size;
    }

    updateSize() {
        this.size = 1;
        for (child in this.children) {
            this.size += child.size;
        }
    }

    swapData(tree) {
        var data = this.data;
        this.setData(tree.getData());
        tree.setData(data);
    }

    removeChild(index) {
        var child = this.children[index];
        this.children.splice(index,1);

        if (child) {
            console.log("remove child data: "+child.data);
            this.size -= child.size;
        }

        return child;
    }
}

class Heap extends Tree {
    // comparator(x,y): function that compares x with y
    // for minheap: comparator should return true for if x is less than y
    // for maxheap: comparator should return true for if x is greater than y
    constructor(data,comparator,parent=null) {
        super(data,parent);
        this.children.push(null);
        this.children.push(null);

        if (!comparator) {
            throw new Error("NullHeapComparatorError");
        }
        this.comparator = comparator;
    }

    getLeftChild() {
        return this.children[0];
    }

    getRightChild() {
        return this.children[1];
    }

    setLeftChild(tree) {
        this.children[0] = tree; 
    }

    setRightChild(tree) {
        this.children[1] = tree; 
    }

    deleteLeft() {
        var child = this.getLeftChild;
        this.setLeftChild(null);
        return child.data;
    }

    deleteRight() {
        var child = this.getRightChild;
        this.setRightChild(null);
        return child.data;
    }

    peek() {
        return this.data;
    }

    siftDown() {
        let left = this.getLeftChild();
        let right = this.getRightChild();

        if (left && right) {
            var swap = this.comparator(left.data,right.data) ? left : right;
            if (this.comparator(swap.data,this.data)) {
                this.swapData(swap);
                swap.siftDown();
            }
        } else if (left) {
            if (this.comparator(left.data,this.data)) {
                this.swapData(left);
                left.siftDown();
            } 
        } else if (right) {
            if (this.comparator(right.data,this.data)) {
                this.swapData(right);
                right.siftDown();
            } 
        }
    } 

    extract() {
        var data = this.data;

        if (this.size === 0) {
            throw new Error("NoElementsException");
        } else if (this.parent === null && this.size === 1) {
            this.size -= 1;
            this.data = null;
            return data;
        }

        let left = this.getLeftChild();
        let right = this.getRightChild();

        let cur = this;

        while (left && right) {
            cur.size -= 1;

            if (left.size > right.size) {
                cur = left;
            } else {
                cur = right;
            }

            left = cur.getLeftChild();
            right = cur.getRightChild();
        }

        if (right) {
            this.swapData(right);
            cur.size -= 1;
            cur.deleteRight();
        } else if (left) {
            this.swapData(left);
            cur.size -= 1;
            cur.deleteLeft();
        } else {
            this.swapData(cur);
            if (cur === cur.parent.getLeftChild()) {
                cur.parent.deleteLeft();
            } else if (cur === cur.parent.getRightChild()) {
                cur.parent.deleteRight();
            } else {
                throw "Error swapping in heap";
            }
        }

        this.siftDown();

        return data;
    }

    siftUp() {
        if (this.parent) {
            if (this.comparator(this.data,this.parent.data)) {
                this.swapData(this.parent);
                this.parent.siftUp();
            }
        }
    }

    insert(data,isTree=false) {
        let left = this.getLeftChild();
        let right = this.getRightChild();
        this.size += 1;

        if (this.data === null) {
            this.data = data;
        } else if (left && right) {
            if (left.size <= right.size) {
                left.insert(data);
            } else {
                right.insert(data);
            }
        } else if (left) {
            var child = new Heap(data,this.comparator,this);
            this.setRightChild(child);
            child.siftUp();
        } else {
            var child = new Heap(data,this.comparator,this);
            this.setLeftChild(child);
            child.siftUp();
        }
    }

    contains(data) {
        if (this.data === data) {
            return true;
        } else if (this.comparator(this.data,data)) {
            return this.getLeftChild().contains(data) || this.getRightChild().contains(data);
        }
    }

    preorderTraverse(tabs=0) {
        var tabSpace = ''
        for (var i = 0; i < tabs; i++) {
            tabSpace += '    ';
        }
        console.log(tabSpace+`Data: ${this.data}`);

        if (this.getLeftChild()) {
            this.getLeftChild().preorderTraverse(tabs+1);
        }

        if (this.getRightChild()) {
            this.getRightChild().preorderTraverse(tabs+1);
        }
    }
}

function assert(bool,msg) {
    if (!bool) {
        throw new Error(msg);
    }
}

function _testHeap() {
    // testing min heap
    let comp = function(x,y) {
        if (x < y) {
            // console.log(x+" is less than "+y);
            return true;
        } else {
            // console.log(x+" is not less than "+y);
            return false;
        }
    };
    let minHeap = new Heap(100,comp);
    assert(minHeap.data === 100,"Heap data is incorrect");

    // test insert
    minHeap.insert(500);
    assert(minHeap.data === 100,"Heap insert is incorrect (data)");
    assert(minHeap.getLeftChild().data === 500,"Heap insert is incorrect (child 1)");

    minHeap.insert(200);
    assert(minHeap.getRightChild().data === 200,"Heap insert is incorrect (child 2)");

    minHeap.insert(10);
    assert(minHeap.data === 10,"Insert is incorrect");

    minHeap.insert(5);
    assert(minHeap.data === 5,"Insert is incorrect");

    minHeap.insert(1);
    assert(minHeap.data === 1,"Insert is incorrect");
    

    //test extract
    assert(minHeap.extract() == 1, "Extract is incorrect");

    assert(minHeap.extract() == 5, "Extract is incorrect");

    assert(minHeap.extract() == 10, "Extract is incorrect");

    assert(minHeap.extract() == 100, "Extract is incorrect");

    assert(minHeap.extract() == 200, "Extract is incorrect");

    assert(minHeap.extract() == 500, "Extract is incorrect");

    //test reuse

    minHeap.insert(777);
    assert(minHeap.data === 777,"Heap insert is incorrect (child 2)");

    minHeap.insert(89);
    assert(minHeap.data === 89,"Insert is incorrect");

    minHeap.insert(44);
    assert(minHeap.data === 44,"Insert is incorrect");

    minHeap.insert(67.1);
    assert(minHeap.data - 67.1 <= 0.001,"Insert is incorrect");

    minHeap.insert(-12.1);
    assert(minHeap.data - (-12.1) <= 0.001,"Insert is incorrect");

    minHeap.insert(-1090.55959);
    assert(minHeap.data - (-1090.55959) <= 0.001,"Insert is incorrect");
}