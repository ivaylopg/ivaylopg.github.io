var sketch = function( nodesP5 ) {
  var system;
  var system2;
  var wind;
  var center;
  var maxDist;
  var mousePos;
  var mouseRange = 200;
  var maxSpeed = 0.2;
  var maxAccel = 0.1;
  var minWind = 0.005;
  var maxWind = 0.03;
  var maxEdges = 3;
  var maxEdgeLength = 200;
  var interactionStartFrames = 120;
  var numNodes = nodesP5.int(100 * (window.innerWidth/2400));
  
  var fillColor1 = 200;
  var fillColor2 = 230;

  var introFade = 255;

  var parentContainer = document.getElementById("nodeField");
  var parentDimensions;
  
  nodesP5.setup = function() {
    parentDimensions = nodesP5.createVector(parentContainer.clientWidth,parentContainer.clientHeight);
    var theCanvas = nodesP5.createCanvas(parentDimensions.x, parentDimensions.y);
    theCanvas.parent(parentContainer);

    wind = nodesP5.createVector(nodesP5.random(-0.5,0.5),nodesP5.random(-0.5,0.5));
    reset();
    remake();
    
  }
  
  var reset = function(){    
    center = nodesP5.createVector(nodesP5.width/2, nodesP5.height/2);
    maxDist = nodesP5.dist(0,0, center.x, center.y);
    mousePos = center.copy();

  }

  var remake = function(){
    introFade = 255;
    system = new NodeSystem(fillColor1, 5, 1.0);
    system2 = new NodeSystem(fillColor2, 3, 0.75);
    for (var i = 0; i < numNodes; i++) {
      system.addNode();
      system2.addNode();
    }
  }
  
  nodesP5.draw = function() {
    if (nodesP5.frameCount > interactionStartFrames) {
      mousePos = nodesP5.createVector(nodesP5.mouseX,nodesP5.mouseY);
      wind = p5.Vector.sub(mousePos, center);
      var windScaled = nodesP5.map(wind.mag(),0.0,maxDist,minWind,maxWind);
      wind.setMag(windScaled);
    }
    
    nodesP5.background(255);
    system.run();
    system2.run();

    //drawMouseRange()

    if (introFade > 0) {
      nodesP5.fill(255,255,255,introFade);
      nodesP5.rect(0,0,nodesP5.width,nodesP5.height);
      introFade-=2;
    };




    // console.log(int(frameRate()));
  }
  
  
  var Node = function(greytone, radius, forceScale) {
    this.grey = greytone;
    this.r = radius;
    this.forceScale = forceScale;
    this.acceleration = wind.copy();
    this.velocity = nodesP5.createVector(nodesP5.random(-0.5,0.5), nodesP5.random(-0.5,0.5));
    this.position = nodesP5.createVector(nodesP5.random(nodesP5.width),nodesP5.random(nodesP5.height));
    this.edges = 0;
    this.edgesOn = false;
    if (nodesP5.random(1) > 0.8) {
      this.edgesOn = true;
    }
    this.mass = nodesP5.random(0.8,1.9);
    if (nodesP5.random(1) > 0.94) {
      this.mass = 3.0;
    }
  };
  
  Node.prototype.run = function() {
    this.update();
    this.display();
  };
  
  Node.prototype.update = function(){
    this.acceleration.add(wind);
    
    if (nodesP5.dist(nodesP5.mouseX,nodesP5.mouseY,this.position.x,this.position.y) < mouseRange){
      var repel = p5.Vector.sub(this.position,mousePos);
      var force = maxWind - nodesP5.map(repel.mag(),0, mouseRange, minWind, maxWind);
      repel.setMag(force/2);
      this.acceleration.add(repel);
    }
    
    if (nodesP5.frameCount > interactionStartFrames) {
      this.acceleration.mult(this.forceScale);
    }
    
    this.velocity.add(this.acceleration);
    
    if (this.velocity.magSq() > (nodesP5.sq(maxSpeed) * this.mass)){
      this.velocity.setMag(maxSpeed * this.mass);
    }
    
    this.position.add(this.velocity);
    
    if (this.position.x < 0){
      this.position.x = nodesP5.width;   
    } else if (this.position.x > nodesP5.width){
      this.position.x = 0;   
    }
    
    if (this.position.y < 0){
      this.position.y = nodesP5.height;   
    } else if (this.position.y > nodesP5.height){
      this.position.y = 0;   
    } 
    
    if (this.acceleration.magSq() > nodesP5.sq(maxAccel)){
      this.acceleration.setMag(maxAccel);
    }
  };
  
  
  Node.prototype.display = function() {
    nodesP5.noStroke();
    nodesP5.fill(this.grey);
    nodesP5.ellipse(this.position.x, this.position.y, this.r, this.r);
  };
  
  var NodeSystem = function(greytone, radius, forceScale) {
    this.grey = greytone;
    this.r = radius;
    this.forceScale = forceScale;
    this.nodes = [];
  };
  
  NodeSystem.prototype.addNode = function() {
    this.nodes.push(new Node(this.grey,this.r, this.forceScale));
  };
  
  NodeSystem.prototype.run = function() {
    for (var i = this.nodes.length-1; i >= 0; i--) {
      var p = this.nodes[i];
      p.edges = 0;
      
      if (p.edgesOn) {
        var edgeGrey = this.grey + 30;
        
        if (edgeGrey > 240) {
          edgeGrey = 240;
        }
        
        nodesP5.stroke(edgeGrey);
        for (var j = this.nodes.length-1; j >= 0; j--) {
          var q = this.nodes[j];
          if (p.edges < maxEdges) {
            if (nodesP5.dist(p.position.x, p.position.y, q.position.x, q.position.y) < maxEdgeLength){
              nodesP5.line(p.position.x, p.position.y, q.position.x, q.position.y);
              p.edges++;
            }
          }
        }
        nodesP5.noStroke();
        
      }
      p.run();
    }
  };
  
  nodesP5.windowResized = function(){
    var newDimensions = nodesP5.createVector(parentContainer.clientWidth,parentContainer.clientHeight);
    var dX = Math.abs(parentDimensions.x - newDimensions.x)/parentDimensions.x;
    var dY = Math.abs(parentDimensions.y - newDimensions.y)/parentDimensions.y;
    parentDimensions = newDimensions.copy();

    nodesP5.resizeCanvas(parentDimensions.x, parentDimensions.y);
    reset();

    if (dX > 0.2 || dY > 0.2) {
      remake();  
    };
    
  }

  var drawMouseRange = function() {
    push();
    var windDraw = wind.copy();
    windDraw.mult(300);
    translate(center.x, center.y);
    stroke(0);
    line(0,0,wind.x,wind.y);
    noStroke();
    pop();
  }

};

var myp5 = new p5(sketch);