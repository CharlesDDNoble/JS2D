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

    setChildren(children) {
        this.children = children;
    }

    getChildren() {
        return this.children;
    }

    isLeaf() {
        return this.children.length;
    }

    updateSize() {
        this.size = 1;
        for (child in this.children) {
            child.updateSize();
            this.size += child.size;
        }
    }

    swapData(tree) {
        var data = this.data;
        this.setData(tree.getData());
        tree.setData(data);
    }

    addChild(tree) {
        this.children.push(tree);
        this.size += 1;
    }

    removeChild(index) {
        var child = this.children[index];
        this.children.splice(index,1);

        if (child) {
            // console.log("remove child data: "+child.data);
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

    /* Returns true if some node contains data equal to the target data */
    /* O(n) operation */
    contains(data) { 
        if (this.data === data) {
            return true;
        } else if (this.comparator(this.data,data)) { 
            // minor optimization, if this is not true then no child of this node
            // can contain the target data
            return this.getLeftChild().contains(data) || this.getRightChild().contains(data);
        } else {
            return false;
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