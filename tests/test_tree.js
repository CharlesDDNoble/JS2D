import * as Test from './test.js';

function testHeap() {
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
    Test.assert(minHeap.data === 100,"Heap data is incorrect");

    // test insert
    minHeap.insert(500);
    Test.assert(minHeap.data === 100,"Heap insert is incorrect (data)");
    Test.assert(minHeap.getLeftChild().data === 500,"Heap insert is incorrect (child 1)");

    minHeap.insert(200);
    Test.assert(minHeap.getRightChild().data === 200,"Heap insert is incorrect (child 2)");

    minHeap.insert(10);
    Test.assert(minHeap.data === 10,"Insert is incorrect");

    minHeap.insert(5);
    Test.assert(minHeap.data === 5,"Insert is incorrect");

    minHeap.insert(1);
    Test.assert(minHeap.data === 1,"Insert is incorrect");
    

    //test extract
    Test.assert(minHeap.extract() == 1, "Extract is incorrect");

    Test.assert(minHeap.extract() == 5, "Extract is incorrect");

    Test.assert(minHeap.extract() == 10, "Extract is incorrect");

    Test.assert(minHeap.extract() == 100, "Extract is incorrect");

    Test.assert(minHeap.extract() == 200, "Extract is incorrect");

    Test.assert(minHeap.extract() == 500, "Extract is incorrect");

    //test reuse

    minHeap.insert(777);
    Test.assert(minHeap.data === 777,"Heap insert is incorrect (child 2)");

    minHeap.insert(89);
    Test.assert(minHeap.data === 89,"Insert is incorrect");

    minHeap.insert(44);
    Test.assert(minHeap.data === 44,"Insert is incorrect");

    minHeap.insert(67.1);
    Test.assert(minHeap.data - 67.1 <= 0.001,"Insert is incorrect");

    minHeap.insert(-12.1);
    Test.assert(minHeap.data - (-12.1) <= 0.001,"Insert is incorrect");

    minHeap.insert(-1090.55959);
    Test.assert(minHeap.data - (-1090.55959) <= 0.001,"Insert is incorrect");
}