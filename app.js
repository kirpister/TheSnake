const scoreCounter = document.querySelector("#score");
const board = document.querySelector("#board");
const playGame = document.querySelector('#start');
const restart = document.querySelector('#restart');


let board_ctx = board.getContext("2d");

const boardGradient = board_ctx.createLinearGradient(-80, 300, 500, -750);
boardGradient.addColorStop(0, "black");
boardGradient.addColorStop(1, "green");

let score = 0;

board_ctx.fillStyle = boardGradient;
board_ctx.fillRect(0, 0, 500, 500);

let crunch = new Audio('apple.mp3');
let music = new Audio('music.mp3');


const Snake = () => {

let snakebody = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]

let changingDir = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;

const snake_body = "green";
const snake_border = "white";
const boardColor = "white";

const getBoard = board.getContext("2d");

const gameOver = () => {

 for (let i = 4; i < snakebody.length; i++) {
    if (snakebody[i].x === snakebody[0].x && snakebody[i].y === snakebody[0].y) return true
  }
  const hitLeftWall = snakebody[0].x < 0;
  const hitRightWall = snakebody[0].x > board.width - 10;
  const hitTopWall = snakebody[0].y < 0;
  const hitBottomWall = snakebody[0].y > board.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall 
}

const startGame = () => {

  music.play();

  if (gameOver()) {
    music.pause();
    resetGame();
   
    alert('GAME OVER!!');
  }
 
  changingDir = false;
  setTimeout(function onTick() {
  restartBoard();
  drawFood();
  growSnake();
  drawSnake();
  startGame();
  
}, 100)
}

startGame();

const restartBoard = () => {
  getBoard.fillStyle = boardGradient;
  getBoard.strokestyle = boardColor;
  getBoard.fillRect(0, 0, board.width, board.height);
  getBoard.strokeRect(0, 0, board.width, board.height);
  }

const drawSnake = () => {
    snakebody.forEach(part => {
      draw(part);
    });
  }

const draw = (snakePart) => {
    getBoard.strokestyle = snake_border;
    getBoard.fillStyle = snake_body;
   
    getBoard.fillRect(snakePart.x, snakePart.y, 10, 10);
    getBoard.strokeRect(snakePart.x, snakePart.y, 10, 10); 
}

const randomizeFood = (min, max) => {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

const drawFood = () => {
  getBoard.strokestyle = "green";
  getBoard.fillStyle = "yellow";
 
  getBoard.fillRect(food_x, food_y, 10, 10);
  getBoard.strokeRect(food_x, food_y, 10, 10);
}

const generateFood = () => {
  food_x = randomizeFood(0, board.width - 10);
  food_y = randomizeFood(0, board.height - 10);

  snakebody.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) {
       generateFood(); }
  });
}

generateFood();

const change_direction = (e) => {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changingDir) return;
  changingDir = true;
  const keyPressed = e.keyCode;
  const up = dy === -10;
  const down = dy === 10;
  const right = dx === 10;
  const left = dx === -10;
  if (keyPressed === LEFT_KEY && !right) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !down) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !left) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !up) {
    dx = 0;
    dy = 10;
  }
}

document.addEventListener("keydown", change_direction);

const growSnake = () => {

  const head = {x: snakebody[0].x + dx, y: snakebody[0].y + dy};
  snakebody.unshift(head);
  const has_eaten_food = snakebody[0].x === food_x && snakebody[0].y === food_y;
  if (has_eaten_food) {
    crunch.play();
    score += 10;
    scoreCounter.textContent = `Score: ${score}`;
    generateFood();
  } else {
    snakebody.pop();
  }
}}

const resetGame = () => {
  window.location.reload();
};

restart.addEventListener('click', resetGame);

playGame.addEventListener('click', Snake);
