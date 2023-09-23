var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var stepX = 20;
var stepY = 0;
var dirX = [80, 60, 40, 20],
    dirY = [0, 0, 0, 0];

var is_downDir = true,
    is_upDir = true, 
    is_rightDir = true, 
    is_leftDir = false;

let score = 0;

let bestScore = localStorage.getItem("bestScore");

document.getElementById('score').innerHTML = "Score : "+score;


let foodX = Math.ceil(Math.random() * (600 - 20));
let foodY = Math.ceil(Math.random() * (600 - 20));
    
let up = document.getElementById('up');
let down = document.getElementById('down');
let left = document.getElementById('left');

let retry = document.getElementById('retry');

var pause_or_continue = false;
    
var keyDir = 0;

var timeProcess;

up.ontouchstart = function(){keyDir = 1;}
down.ontouchstart = function(){keyDir = 2;}
left.ontouchstart = function(){keyDir = 3;}
right.ontouchstart = function(){keyDir = 4;}

// Game Loop
function process() {
  context.clearRect(0, 0, 600, 600);
  
  if(keyDir == 1 && is_upDir){
    is_downDir = false;
    is_leftDir = true;
    is_rightDir = true;
    stepY = -20;
    stepX = 0;
  }else if(keyDir == 2 && is_downDir){
    is_upDir = false;
    is_leftDir = true;
    is_rightDir = true;
    stepY = 20;
    stepX = 0; 
  }
  
  if(keyDir == 3 && is_leftDir){
    is_rightDir = false;
    is_downDir = true;
    is_upDir = true;
    stepX = -20;
    stepY = 0;
  }else if(keyDir == 4 && is_rightDir){
    is_leftDir = false;
    is_downDir = true;
    is_upDir = true;
    stepX = 20;
    stepY = 0;
  }
  
  if (pause_or_continue){
    clearTimeout(timeProcess);
  }else{
    timeProcess = setTimeout(process, 100);
  }
  move();
  
  wallsColide();
  selfColide();
  
  // Draw each part of Snake
  for(let v = 0; v < dirX.length; v++){
    draw(dirX[v], dirY[v]);
  }
  
  
  generate_food();
  
  //Show the Best Score
  document.getElementById('best_score').innerHTML = "Best Score : "+localStorage.getItem("bestScore");
  
  //requestAnimationFrame(process);
}

// Move Snake
function move(){
  const headX = dirX[0] + stepX;
  const headY = dirY[0] + stepY;
  
  // Add new head to body
  dirX.unshift(headX);
  dirY.unshift(headY);
  
  // When head equal food position
  const on_eat_food = dirX[0] === foodX && dirY[0] === foodY;
  
  if(on_eat_food){
    // Initialize for new location
    foodX = Math.ceil(Math.random() * (600 - 20));
    foodY = Math.ceil(Math.random() * (600 - 20));
    
    // Increase Score
    score++;
    document.getElementById('score').innerHTML = "Score : "+score;
    
    // Generate new Location
    generate_food();
  }else{
    // Remove last part of snake body
     dirX.pop();
     dirY.pop();
  }
 
}

// Draw individual body part
function draw(x, y){
  context.beginPath();
  context.rect(x, y, 20, 20);
  context.fillStyle = 'green';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = 'black';
  context.stroke();
}

// When Snake colide with wall
function wallsColide(){
  if(dirX[0] >= 600 || dirY[0] >= 600 || dirX[0] <= -1 || dirY[0] <= -1){
    message("Game Over");
    clearTimeout(timeProcess);
    retry.style.visibility = 'visible';
    
    if(score > bestScore){
      bestScore = score;
      //Save the highest score to local Storage
      localStorage.setItem("bestScore", bestScore.toString());
    }
    
    retry.ontouchstart = function(){
      window.location.reload();
    }
    
  }
}

// When head of snake colide with his body
function selfColide(){
  for(let h = 0; h < dirX.length; h++){
    if(dirX[0] == dirX[h+1] && dirY[0] == dirY[h+1]){
      message("Game Over");
      clearTimeout(timeProcess);
      
      retry.style.visibility = 'visible';
      
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore.toString());
      }
      
      retry.ontouchstart = function() {
        window.location.reload();
      }
    }
  }
}

function food(x, y){
  context.beginPath();
  context.rect(x, y, 20, 20);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.stroke();
}

function generate_food(){
  while (true) {
    // Need to display food to paire position (0, 20, 40, ...)
    if (foodX % 20 == 0 && foodY % 20 == 0) {
      food(foodX, foodY);
      break;
    }else {
      foodX = Math.ceil(Math.random() * (600 - 20));
      foodY = Math.ceil(Math.random() * (600 - 20));
    }
  }
  
  // Avoid display food at the location of Snake body part
  for(let m = 0; m < dirX.length; m++){
    if(foodX == dirX[m] && foodY == dirY[m]){
      foodX = Math.ceil(Math.random() * (600 - 20));
      foodY = Math.ceil(Math.random() * (600 - 20));
      generate_food();
    }
  }
}

function message(text){
  context.beginPath();
  context.font = "50px Arial";
  context.fillStyle = "red";
  context.fillText(text, 180, 200);
}

function pause(){
  let btn = document.getElementById('btn1');
  btn.textContent = 'Continue';
  if (pause_or_continue){
    btn.textContent = 'Pause';
    continu()
  }
  else{
    pause_or_continue = true;
  }
  
}

function continu(){
   pause_or_continue = false;
   process();
}

process();
