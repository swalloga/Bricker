const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("play-button");

let score = 0;
let lives = 3;

// define ball movement
let dx = 2;
let dy = -2;

// define ball position and draw ball
let x = canvas.width/2;
let y = canvas.height-30;
let ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x:0, y:0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
playButton.addEventListener("click", draw, false);

function keyDownHandler(e) {
  if (e.keyCode === 39 ) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39 ) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawball() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r*(brickHeight+ brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status === 1) {
        if(x > b.x - ballRadius && x < b.x+brickWidth + ballRadius && y > b.y - ballRadius && y < b.y+brickHeight + ballRadius) {
          dy = -dy + 1;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("It's Lit. Your bricker game is fire.");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px 'ZCOOL KuaiLe', cursive";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Points: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "20px 'ZCOOL KuaiLe', cursive";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-85, 20);
}

function draw() {
  playButton.style.display = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawball();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  requestAnimationFrame(draw);


  // make ball bounce off sides of canvas
  if (x - ballRadius + dx < 0 || x + ballRadius + dx > canvas.width) {
    dx = -dx;
  }

  if (y - ballRadius + dy < 0) {
    dy = -dy + 1;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
        playButton.style.display = "block";
      } else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width-paddleWidth)/2;
          lives -= 1;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}
