let brainJSON;
let loadBrainFromFile = true;
let fps = 25;
let startLength = 4;
let showChart = false;


//-----------Game & App Size--------------
let gameWidth = 40;
let gameHeight = 40;
let cellSize = 6;

let appWidth;
let appHeight;

let chartHeight = 80;
//----------------------------------



//-------Grid of Snake Games--------
let gameCols = 3;
let gameRows = 2;
let paddings = 2;
let games = [];
//----------------------------------



//------Stats--------
let generation = 0;
let population = 0;
let alive = 0;

let lengthMax = 0;
let scoreMax = 0;
let currentScoreMax = 0;

let averageScore = 0
//----------------------------------



//------Game Style------------------
let gameBackgroundColor = '#232323';
let snakeColor = '#00AA00';
let foodColor = '#0055AA';
let backgroundColor = '#000000';
//----------------------------------



//Array with snakes sorted by scores form low to high
let bestSnake;

// Top 'n' snakes to pick up for next generation
let topCount = 1;

// Instance of best snake ever
let bestSnakeEver;

// Mutation percentage
let mutationRate = 0.05;


let chart;


function setup() {
  
  frameRate(fps);
  
  //Initiallize stats
  population = gameCols*gameRows;
  alive = population;
  lengthMax = startLength;
  scoreMax = 0;
  currentScoreMax = 0;
  
  //Calculate app size
  if(!showChart){
    chartHeight=0
  }
  appWidth = paddings+paddings*gameCols+gameCols*cellSize*gameWidth;
  appHeight = paddings+paddings*gameRows+gameRows*cellSize*gameHeight+65+chartHeight;
  createCanvas(appWidth, appHeight);
  
  //Create first generation
  createGeneration();
  
  //create Chart
  if(showChart){
    chart = new Chart(0, appHeight, appWidth, chartHeight, []);
    chart.resolution = 400;
  }
  

}


// Save brain function
function keyPressed(){
  if(key==="s"){
    saveJSON(bestSnakeEver.brain, 'snake.json');
  }
}


// Load brain function
function preload(){
 if(loadBrainFromFile){
   brainJSON = loadJSON("brain.json");
 }
}


function createGeneration(){
 
  generation +=1;
  
  for(let i =0;i<gameCols;i++){
    games[i] = [];
    for(let j =0;j<gameRows;j++){
      let x = paddings+paddings*i+i*cellSize*gameWidth;
      let y = paddings+paddings*j+j*cellSize*gameHeight;
      
      
      // If not first generation
      if(bestSnake){
        
        let rand = bestSnake.length-1-Math.floor(Math.random()*topCount);
        let snake = bestSnake[rand];
       
        //create new snake game
        games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength,snake.brain);
        games[i][j].mutate(mutationRate);  
      }
      else{
        
        //Load brain from JSON for first generation
        if(brainJSON){
          let snakeBrain = NeuralNetwork.deserialize(brainJSON);
          games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength,snakeBrain);

        }
        
        //Or create snake with default brain
        else{
          games[i][j] = new Game(x,y,gameWidth,gameHeight,cellSize,startLength);
        }
        
      }
      
      //Set style
      games[i][j].backgroundColor = gameBackgroundColor;
      games[i][j].snakeColor = snakeColor;
      games[i][j].foodColor = foodColor;
      games[i][j].startLength = startLength;
    }
  }
}



function draw() {
  background(backgroundColor);
  
  //Update all games
  for(let i =0;i<gameCols;i++){
     for(let j =0;j<gameRows;j++){
       games[i][j].update();
     }
  }
  
  //Update data
  updateData();
  
  if(showChart){
    chart.update();
  }

}



function updateData(){

  alive = 0;
  currentScoreMax = 0;
  
  bestSnake = [];
  
  let sumScore = 0;
  
  for(let i =0;i<gameCols;i++){
     for(let j =0;j<gameRows;j++){
       
      //How many are alive
       if(games[i][j].alive){
         alive+=1;
       }
       
       //Best snake ever?
       if(games[i][j].alive==false){
         if(games[i][j].score>=scoreMax){
           scoreMax = games[i][j].score;
           bestSnakeEver = games[i][j];
         }
         if(games[i][j].score>=currentScoreMax){
            currentScoreMax = games[i][j].score;
         }
         
         sumScore += games[i][j].score;
       }
       
       //Best length
       if(games[i][j].snakeLength>lengthMax){
         lengthMax = games[i][j].snakeLength;
       }
    
       //Fill array with all snakes to sort next
       bestSnake.push(games[i][j]);
     }
  }
  
  
  
  if(alive==0){
    // Sort snakes by score from low to high
    bestSnake.sort(function(a, b){
      return a.score-b.score
    })  
    
    averageScore = Math.round(sumScore/(gameCols*gameRows));
    
    if(showChart){
      chart.data.push(averageScore);
    }
    
    averageScore = 0;
    
    //Create new generation
    createGeneration();
    
  }
  
  
  
  
  // Stats Field
  
  fill('#ffffff');
  textFont('Ubuntu',21);
  text(generation, 16, appHeight-34-chartHeight);
  
  fill('#666666');
  textFont('Ubuntu',11);
  text('generation', 16, appHeight-18-chartHeight);
  
  
  fill('#ffffff');
  textFont('Ubuntu',21);
  text(alive+' of '+population, 112, appHeight-34-chartHeight);
  
  fill('#666666');
  textFont('Ubuntu',11);
  text('alive', 112, appHeight-18-chartHeight);
  
  fill('#ffffff');
  textFont('Ubuntu',21);
  text(lengthMax-startLength, appWidth-300, appHeight-34-chartHeight);
  
  fill('#666666');
  textFont('Ubuntu',11);
  text('max food', appWidth-300, appHeight-18-chartHeight);
  
  fill('#ffffff');
  textFont('Ubuntu',21);
  text(currentScoreMax, appWidth-200, appHeight-34-chartHeight);
  
  fill('#666666');
  textFont('Ubuntu',11);
  text('current score', appWidth-200, appHeight-18-chartHeight);
  
  fill('#ffffff');
  textFont('Ubuntu',21);
  text(scoreMax, appWidth-90, appHeight-34-chartHeight);
  
  fill('#666666');
  textFont('Ubuntu',11);
  text('highest score', appWidth-90, appHeight-18-chartHeight);
  

}



