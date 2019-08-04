var pattern = ""
var insertButton;
var resetButton;
var bg=240;
var updated = false;
var highlight = false;
var tempNode;
var drawTree = false;
var decodemessage = false;
var message = "";


class Node{
    constructor(freqs) {
      this.freq = freqs.freq;
        this.data = freqs.data;
      this.left = null;
      this.right = null;
          this.x = null;
          this.y = null;
    }
      draw(){
          ellipse(this.x, this.y, 50);
      }
  }


class Huffman{
    constructor() {
      this.str = null;
      this.codes = {};
      this.tuples = [];
      this.root = null;
    }

    newNode(key=null, freq=null)
    {
        var arr = {
            "data": key,
            "freq": freq
        };
        var node = new Node(arr);
        return node;
    }

    frequency(stringValue)
    {
      this.str = stringValue;
      console.log(this.str);
      var freqs = {};
      for(var i in stringValue)
      {
          if(freqs[stringValue[i]] == undefined){
              freqs[stringValue[i]] = 1;
          }
          else {
              freqs[stringValue[i]] += 1;
          }
      }
      return freqs;
    }

    frequencySort(freqArr)
    {
      for(var l in freqArr)
      {
          var newNode = this.newNode(freqArr[l], l);
          this.tuples.push(newNode);
      }
      return this.tuples.sort(function(a, b){return a.data - b.data});
    }

    insert(newNode)
    {
        this.tuples.push(newNode);
        this.tuples.sort(function(a, b){return a.data - b.data});
    }

    extractMin()
    {
        var min = this.tuples.shift();
        return min;
    }

    buildHuffmanTree(tup = this.tuples)
    {
        while(tup.length > 1)
        {
            var x,y;
            var z = this.newNode();
            z.left = x = this.extractMin();
            z.right = y = this.extractMin();
            z.freq = '$';
            z.data = x.data + y.data;
            this.insert(z);
        }
        return this.tuples[0];
    }

    inorder(node, x=width/2, y=50, spaceFactor=300){
      if(node!=null){
        stroke('#76ff03');
        if(node.left!=null){
          stroke('#76ff03');
          line(x, y, x-spaceFactor, y+65);
        }
        if(node.right!=null){
          stroke('#76ff03');
          line(x, y, x+spaceFactor, y+65);
        }
        this.inorder(node.left, x-spaceFactor, y+65, spaceFactor/2);
        stroke('#ffffff');
        fill('#fff9c4');
        if(this.isLeaf(node))
          fill('#ff3d00');

            if(spaceFactor > 100)
          {
            ellipse(x, y, 50, 50);
            textSize(16);
          }
        else{
          if(spaceFactor > 50)
            {
              ellipse(x, y, 40, 40);
              textSize(15);
            }
          else{
            if(spaceFactor > 25)
              {
                ellipse(x, y, 30, 30);
                textSize(14);
              }
              else{
                ellipse(x, y, 25, 25);
                textSize(12);
              }
          }
        }

        noStroke();
        fill('#000000');
        text(node.freq ,x-2, y+7);
        this.inorder(node.right, x+spaceFactor, y+65, spaceFactor/2);
      }
    }

    isLeaf(node)
    {
        return !node.left && !node.right;
    }

    assignHuffmanCodes(node, pat)
    {
        if(node.left) {
          this.assignHuffmanCodes(node.left, pat+'0');
        }
        if(node.right) {
            this.assignHuffmanCodes(node.right, pat+'1');
        }
        if(this.isLeaf(node))
        {
            this.codes[node.freq] = pat;
        }
    }

    encode(str = this.str) {
      var output = '';
      for(var s in str)
          output += this.codes[str[s]];
      return output;
    }

    huffmanCodes(stringValue)
    {
      this.str = null;
      this.codes = {};
      this.tuples = [];
      this.decodedString = "";
      var freq = this.frequency(stringValue);
      var f = this.frequencySort(freq);
      var root = this.buildHuffmanTree(f);
      this.root = root;
      console.log(root);
      drawTree = true;
      this.inorder(root);
      this.assignHuffmanCodes(root, pattern);
      console.log(this.codes);
      var encodedString = this.encode();
      console.log(encodedString);
      this.displayEncodedCodes();

      var decodedString = this.decodeCodes(root, encodedString);
      console.log(decodedString);
    }

    decodeCodes(root, encodedValue)
    {
      var output = "";
      var p = root;
      for(var bit in encodedValue)
      {
        if(encodedValue[bit]=='0')
          p = p.left;
        else
          p=p.right; 
        
        if(this.isLeaf(p))
        {
          output+=p.freq;
          p=root;
        }  
      }
      return output;
    }

    displayEncodedCodes()
    {
      var count = 0;
      var textPosX = width - 100;
      var textPosY = height - 500;
      var message = "Huffman Codes: ";
      textSize(18);
      fill('#2fc484');
      text(message, textPosX - 50, textPosY - 20);
      for(var code in this.codes)
      {
        textSize(18);
        fill('#eb4034');
        text(code+"  ", textPosX - 20, textPosY + count * 20);
        fill('#000000');
        text(this.codes[code], textPosX, textPosY + count * 20);
        count ++;
      }
    }

    displayDecodedMessage(msg)
    {
      var decoded = this.decodeCodes(this.root, msg);
      var textPosX = width - 4*width/5;
      var textPosY = height - 50;
      var opmsg = "The decoded message is: ";
      textSize(18);
      fill('#2fc484');
      text(opmsg, textPosX - 50, textPosY - 20);
      fill('#4e342e');
      text(decoded, textPosX, textPosY);
    }
}

var huffman = new Huffman;

function setup()
{
    var cnv = createCanvas(windowWidth, windowHeight - windowHeight/5);
    cnv.style('display', 'block');
    cnv.position(0, 60);
    inputInsert = createInput();
    inputInsert.size(300, 48);
  
    buttonInsert = createButton('Encode');
    buttonInsert.addClass('button');
    buttonInsert.addClass('buttonInsert');
    // message = createElement('h2', 'Enter a string');
    buttonInsert.mousePressed(insertPressed);
    
    inputDel = createInput();
    inputDel.size(300, 48);
    
    buttonDecode = createButton('Decode');
    buttonDecode.position(inputDel.x+inputDel.width , windowHeight-80 );
    buttonDecode.addClass('button');
    buttonDecode.addClass('buttonDel');
    buttonDecode.mousePressed(decodePressed);
    buttonDecode.center('horizontal');

    inputDel.position(buttonDecode.x+150, buttonDecode.y);

    buttonInsert.position(buttonDecode.x - 500, buttonDecode.y);
    inputInsert.position(buttonInsert.x + 150, buttonDecode.y);

    resetButton = createButton("Reset");
    resetButton.addClass('button');
    resetButton.addClass('resetButton');
    resetButton.mousePressed(resetAll);
    resetButton.position(inputDel.x + inputDel.width + 50, inputDel.y);
    // message.position(buttonInsert.x, buttonInsert.y + 5)
		background('#ffffff');
  
 
}

function draw()
{
  background('#ffffff');
  // drawCircle();

  if(drawTree)
  {
    huffman.inorder(huffman.root);
    huffman.displayEncodedCodes();
    // drawTree = false;
  }
  if(decodemessage)
  {
    huffman.displayDecodedMessage(message);
  }
  if(updated){
		background('#ffffff');
    // background(66, 135, 245);
    insertPressed();
    updated= false;
  }
  if(highlight)
  {
		background('#ffffff');
    highlight = false;
    drawTree = false;
    decodemessage = false;
  }
}

function insertPressed () {
  var stringValue = inputInsert.value();
  updated = true;

  huffman.huffmanCodes(stringValue);
}

function decodePressed () {
  // highlight = true;
  message = inputDel.value();
  var decodedString = huffman.decodeCodes(huffman.root, message);
  console.log(decodedString);
  decodemessage = true;
  huffman.displayDecodedMessage(message);
}

function resetAll()
{
  highlight = true;
}