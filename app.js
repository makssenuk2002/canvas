var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var ballRadius = 15;
var x = canvas.width / 2;
var y = 30;
var dx = 0;
var dy = 0;

var gravity = 0.14;
var bounce = 0.2;

var obstacles = [];
var squares = [];

function createObstaclePyramid() {
  var rows = 4;
  var ballsInRow = 3;
  var startX = canvas.width / 2;
  var startY = 100;
  var gapX = 100;
  var gapY = 110;

  for (var row = 0; row < rows; row++) {
    var rowWidth = ballsInRow * gapX - gapX;
    var startXForRow = startX - rowWidth / 2;
    for (var ball = 0; ball < ballsInRow; ball++) {
      var x = startXForRow + ball * gapX;
      var y = startY + row * gapY;
      obstacles.push({ x: x, y: y, radius: 16 });
    }
    ballsInRow++;
  }
}

createObstaclePyramid();

function createSquares() {
  var squareSize = 80;
  var startX = 50;
  var startY = canvas.height - squareSize - 120;
  for (var i = 0; i < 5; i++) {
    var x = startX + i * (squareSize + 20);
    squares.push({ x: x, y: startY, size: squareSize });
  }
}

createSquares();

var isFalling = false;

function startFalling() {
  isFalling = true;
  dx = (Math.random() - 0.5) * 4;
  dy = (Math.random() - 0.5) * 4;
}

var images = [];
var imageUrls = [
  { url: "img/Group1.png", width: 75, height: 58 },
  { url: "img/Group2.png", width: 75, height: 58 },
  { url: "img/Group3.png", width: 75, height: 58 },
  { url: "img/Group4.png", width: 75, height: 58 },
  { url: "img/Group5.png", width: 75, height: 58 }
];

function loadImages() {
  var loadedImages = 0;
  for (var i = 0; i < imageUrls.length; i++) {
    var img = new Image();
    img.onload = function () {
      loadedImages++;
      if (loadedImages === imageUrls.length) {
        animate();
      }
    };
    img.src = imageUrls[i].url;
    img.width = imageUrls[i].width;
    img.height = imageUrls[i].height;
    images.push(img);
  }
}

loadImages();

function drawBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isFalling) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  } else {
    dy += gravity;

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    ctx.drawImage(img, 65 + i * (img.width + 20), canvas.height - img.height - 50, img.width, img.height);
  }

  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    var distanceX = x - obstacle.x;
    var distanceY = y - obstacle.y;
    var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < ballRadius + obstacle.radius) {
      var angle = Math.atan2(distanceY, distanceX);
      var targetX = obstacle.x + Math.cos(angle) * (ballRadius + obstacle.radius);
      var targetY = obstacle.y + Math.sin(angle) * (ballRadius + obstacle.radius);
      x = targetX;
      y = targetY;
      dx = -dx;
      dy = -dy * bounce;
    }
  }

  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    if (x + ballRadius > 50 + i * (img.width + 20) && x - ballRadius < 50 + i * (img.width + 20) + img.width &&
      y + ballRadius > canvas.height - img.height - 50 && y - ballRadius < canvas.height - 50) {
      document.getElementById("winNumber").innerText = i + 1 + '!';
      showModal();
      isFalling = false;
      return;
    }
  }

  x += dx;
  y += dy;

  if (x > canvas.width) {
    x = 0;
  } else if (x < 0) {
    x = canvas.width;
  }

  if (y > canvas.height) {
    y = 0;
  } else if (y < 0) {
    y = canvas.height;
  }
}

function animate() {
  requestAnimationFrame(animate);
  drawBall();
}

function showModal() {
  var modal = document.getElementById("myModal");
  var container = document.getElementById("container");
  modal.style.display = "flex";
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
}