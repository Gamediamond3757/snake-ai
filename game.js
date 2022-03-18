class Game {

  constructor(x, y, width, height, cellSize, length, brain) {
    
    //Game Position & Size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;

    this.startLength = length;
    this.snakeLength = this.startLength;

    //Map
    this.map = [];
    this.emptyID = 0;
    this.snakeID = 1;
    this.foodID = 2;
    this.tempID = 3;
    this.snakeX = 0
    this.snakeY = 0;
    this.foodX = 0
    this.foodY = 0;
    this.direction = createVector(1, 0);

    //Style
    this.backgroundColor = '#232323';
    this.snakeColor = '#00AA00';
    this.foodColor = '#0055AA';
    this.deadSnakeColor = '#003400';

    this.initMap();
    
    
    //Bonus Score System
    this.bonusClose = 2;
    this.bonusNotClose = -3;
    this.bonusFood = 50;
    this.bonusDead = -100;
    
    
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(12, 2, 4);
    }
    this.alive = true;

    this.score = 0;
  }


  //Create empty map
  initMap() {
    this.direction = createVector(1, 0);

    for (let i = 0; i < this.width; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.map[i][j] = this.emptyID;
      }
    }

    this.snakeLength = this.startLength;
    this.createSnake(this.startLength);
    this.createFood();
  }
  
  

  //Create snake
  createSnake(length) {
    this.snakeX = floor(random(0, this.width));
    this.snakeY = floor(random(0, this.height));

    while (this.snakeX - length < 0) {
      this.snakeX = floor(random(0, this.width));
      this.snakeY = floor(random(0, this.height));
    }

    for (let i = 0; i < length; i++) {
      this.map[this.snakeX - i][this.snakeY] = this.snakeID;
    }

  }


  //Create food
  createFood() {
    this.foodX = floor(random(0, this.width));
    this.foodY = floor(random(0, this.height));

    while (this.map[this.foodX][this.foodY] !== this.emptyID) {
      this.foodX = floor(random(0, this.width));
      this.foodY = floor(random(0, this.height));
    }

    this.map[this.foodX][this.foodY] = this.foodID;
  }

  //Remove temp cells
  normalizeMap() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.map[i][j] == this.tempID) {
          this.map[i][j] = this.snakeID;
        }
      }
    }
  }


  //Snake movement function
  moveSnake(xdir, ydir) {
    
    //calculate new snake position
    let newposX = this.snakeX + xdir;
    let newposY = this.snakeY + ydir;
    
    //how far snake was from food
    let distanceOld = Math.abs(this.snakeX-this.foodX)+Math.abs(this.snakeY-this.foodY)
    
    //how far snake form food now
    let distanceNew = Math.abs(newposX-this.foodX)+Math.abs(newposY-this.foodY)
    
    //If closer to food + score, - if not
    if(distanceNew<=distanceOld){
      this.score+=this.bonusClose;
    }
    else{
      this.score +=this.bonusNotClose;
    }
    
    // If snake is not leaving the map
    if ((newposX < this.width) && (newposY < this.height) && (newposX >= 0) && (newposY >= 0)) {
     
      //If hit food
      if (this.map[newposX][newposY] == this.foodID) {
        this.snakeX = newposX;
        this.snakeY = newposY;
        this.map[newposX][newposY] = this.snakeID;
        this.createFood();
        this.snakeLength += 1;
        this.score += this.bonusFood;
        return;
      } 
      
      //If hit yourself
      else if (this.map[newposX][newposY] == this.snakeID) {
        this.alive = false;
        this.snakeColor = this.deadSnakeColor;
        this.foodColor = this.backgroundColor;
        this.score +=this.bonusDead;
        return;
      } else {
        this.map[this.snakeX][this.snakeY] = this.emptyID;
      }

      this.map[newposX][newposY] = this.tempID;
      this.moveTail(this.snakeX, this.snakeY);
      this.snakeX = newposX;
      this.snakeY = newposY;

      this.normalizeMap();
    }
    //If out of the map
    else {
      this.alive = false;
      this.score +=this.bonusDead;
      this.snakeColor = this.deadSnakeColor;
      this.foodColor = this.backgroundColor;
    }
  }

  
  //Move the snake tail
  moveTail(xpos, ypos) {

    if ((xpos - 1) >= 0) {
      if (this.map[xpos - 1][ypos] == this.snakeID) {
        this.map[xpos][ypos] = this.tempID;
        this.map[xpos - 1][ypos] = this.emptyID;
        this.moveTail(xpos - 1, ypos);
        return;
      }
    }

    if ((ypos - 1) >= 0) {
      if (this.map[xpos][ypos - 1] == this.snakeID) {
        this.map[xpos][ypos] = this.tempID;
        this.map[xpos][ypos - 1] = this.emptyID;
        this.moveTail(xpos, ypos - 1);
        return;
      }
    }

    if ((xpos + 1) < this.width) {
      if (this.map[xpos + 1][ypos] == this.snakeID) {
        this.map[xpos][ypos] = this.tempID;
        this.map[xpos + 1][ypos] = this.emptyID;
        this.moveTail(xpos + 1, ypos);
        return;
      }
    }
    if ((ypos + 1) < this.height) {
      if (this.map[xpos][ypos + 1] == this.snakeID) {
        this.map[xpos][ypos] = this.tempID;
        this.map[xpos][ypos + 1] = this.emptyID;
        this.moveTail(xpos, ypos + 1);
        return;
      }
    }
  }

  changeDirection(dir) {
    switch (dir) {
      case 37:
        if (this.direction.x !== 1) {
          this.direction = createVector(-1, 0);
        }
        break;
      case 39:
        if (this.direction.x !== -1) {
          this.direction = createVector(1, 0);
        }
        break;
      case 38:
        if (this.direction.y !== 1) {
          this.direction = createVector(0, -1);
        }
        break;
      case 40:
        if (this.direction.y !== -1) {
          this.direction = createVector(0, 1);
        }
        break;
    }
  }


  // Draw Map function
  drawMap() {
    
    noStroke();
    fill(this.backgroundColor);
    rect(this.x, this.y, this.width * this.cellSize, this.height * this.cellSize);

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.map[i][j] == this.snakeID) {
         fill(this.snakeColor);
        } else if (this.map[i][j] == this.foodID) {
          fill(this.foodColor);
        }
        if (this.map[i][j] !== this.emptyID) {
          rect(this.x + i * this.cellSize, this.y + j * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }

  }

  
  //Update Function
  
  update() {
    this.drawMap();
    
    if(this.score<-100){
      this.alive = false;
      this.snakeColor = this.deadSnakeColor;
      this.foodColor = this.backgroundColor;
    }


    fill('#666666');

    if (this.alive) {

      fill('#aaaaaa');

      this.moveSnake(this.direction.x, this.direction.y);
      this.think();
    }

    textFont('Ubuntu', 8);
    text(this.score, this.x + 4, this.y + 8);

  }

  
  //The main Snake AI Function
  think() {
    
    let input = [];

    let n1;
    let n2;
    let n3;
    let n4;
    let n5;
    let n6;
    let n7;
    let n8;
    
    if((this.snakeX > this.foodX)&&(this.snakeY > this.foodY)){
      n1 = 1;
    }
    else{
      n1 = 0
    }
    
    if((this.snakeX == this.foodX)&&(this.snakeY > this.foodY)){
      n2 = 1;
    }
    else{
      n2 = 0
    }
    
    if((this.snakeX < this.foodX)&&(this.snakeY > this.foodY)){
      n3 = 1;
    }
    else{
      n3 = 0
    }
    
    if((this.snakeX < this.foodX)&&(this.snakeY == this.foodY)){
      n4 = 1;
    }
    else{
      n4 = 0
    }
    
    if((this.snakeX < this.foodX)&&(this.snakeY < this.foodY)){
      n5 = 1;
    }
    else{
      n5 = 0
    }
    
    if((this.snakeX == this.foodX)&&(this.snakeY < this.foodY)){
      n6 = 1;
    }
    else{
      n6 = 0
    }
      
    
    if((this.snakeX > this.foodX)&&(this.snakeY < this.foodY)){
      n7 = 1;
    }
    else{
      n7 = 0
    }
    
    if((this.snakeX > this.foodX)&&(this.snakeY == this.foodY)){
      n8 = 1;
    }
    else{
      n8 = 0
    }
    
    //vision
    input.push(this.checkDir(this.snakeX,this.snakeY-1));
    input.push(this.checkDir(this.snakeX,this.snakeY+1));
    input.push(this.checkDir(this.snakeX-1,this.snakeY));
    input.push(this.checkDir(this.snakeX+1,this.snakeY));
    
    //food dirrection
    input.push(n1);
    input.push(n2);
    input.push(n3);
    input.push(n4);
    input.push(n5);
    input.push(n6);
    input.push(n7);
    input.push(n8);
    
    
    let output = this.brain.predict(input);
    let result = 37 + output.indexOf(Math.max(...output));
    this.changeDirection(result);
    
  }
  
  mutate(val) {
    this.brain.mutate(val);
  }


  checkDir(newposX, newposY){
    if ((newposX < this.width) && (newposY < this.height) && (newposX >= 0) && (newposY >= 0)) {
      if (this.map[newposX][newposY] == this.foodID) {
        return 0;
      } else if (this.map[newposX][newposY] == this.snakeID) {
        return 1;
      } else {
        return 0;
      }
    }
      else {
        return 1;
      }
  }




}