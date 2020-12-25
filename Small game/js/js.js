// useful to have them as global variables
let canvas, ctx, w, h; 
let mousePos;

// an empty array!
let balls = []; 
let enemy = [];
let number_enemy = 1;
var dead = false;
//let gamePaused = false;
var bg = new Image();
bg.src = "img/bg_img.jpg";

let player;
var paused = false;
function createPlayer(player_name, player_size)
{
    const p = {
    x: 10,
    y: 10,
    width: player_size,
    height: player_size,
    color: 'red',
    nickname: player_name
  } 
  return p;
}



function init(number_en) {
  // called AFTER the page has been loaded
  canvas = document.querySelector("#myCanvas");
  
  // often useful
  w = canvas.width; 
  h = canvas.height;  
  // important, we will draw with this object
  ctx = canvas.getContext('2d');
  dead = false;
  let input_player_name = document.querySelector(".input_name_player");
  if(input_player_name.value == "")
  {
    alert("Введіть нікнейм гравця!");
    location.reload();
  }
  else
  {
    let input_player_size = document.querySelector('.input_size_player');
    if(input_player_size.value == "")
    {
      
      alert("Введіть значення розміру гравця!(Використовуйте цифри)");
      location.reload();
    }
    else
    {
      let player_size = +input_player_size.value;
      player = createPlayer(input_player_name.value ,player_size);
      let input_num_b = document.querySelector('.input_number_balls');
      if(input_num_b.value == "")
      {      
        alert("Введіть значення кількості кульок!(Використовуйте цифри)");
        location.reload();
      } 
      else
      {
        // create balls
        balls = createBalls(input_num_b.value);
        enemy = createEnemies(number_en);

        // add a mousemove event listener to the canvas
        canvas.addEventListener('mousemove', mouseMoved);
        // ready to go !

        mainLoop();
      }  
    }
  }
  
}
    

function draw() {
  ctx.drawImage(bg,0,0,600,600);
}

function mouseMoved(evt) {
  mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
  // necessary work in the canvas coordinate system
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function movePlayerWithMouse() {
  if(mousePos !== undefined) {
    player.x = mousePos.x;
    player.y = mousePos.y;
  }
}

function mainLoop() {
  // 1 - clear the canvas
  ctx.clearRect(0, 0, w, h);
  draw();
  
  // draw the ball and the player
  drawFilledRectangle(player);
  drawAllBalls(balls);
  drawNumberOfBallsAlive(balls);
  drawAllEnemies(enemy);
  // animate the ball that is bouncing all over the walls
  moveAllBalls(balls);
  moveEnemy(enemy);
  movePlayerWithMouse();
  
  // ask for a new animation frame
  if(!dead && !paused)
  {
    requestAnimationFrame(mainLoop);
  }
}

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
  let testX = cx;
  let testY = cy;
  if (testX < x0) testX = x0;
  if (testX > (x0 + w0)) testX = (x0 + w0);
  if (testY < y0) testY = y0;
  if (testY > (y0+h0)) testY = (y0 + h0);
  return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) <  r * r);
}


function createEnemies(n) {
  // empty array
  const enemyArray = [];
  
  // create n balls
  for(let i=0; i < n; i++) {
    const b = {
      x: w/2,
      y: h/2,
      radius: 5 + 30 * Math.random(), // between 5 and 35
      speedX: -5 + 10 * Math.random(), // between -5 and + 5
      speedY: -5 + 10 * Math.random(), // between -5 and + 5
      color: 'black',
    }
    // add ball b to the array
     enemyArray.push(b);
  }
  // returns the array full of randomly created balls
  return enemyArray;
}



function createBalls(n) {
  // empty array
  const ballArray = [];
  let input_speed = document.querySelector(".input_speed_balls");
  if(input_speed.value == "")
  {
    alert("Введіть значення максимальної швидкості кульок!(Використовуйте цифри)");
    location.reload();
  }
  else
  {
    let input_size_min = document.querySelector(".input_min_size");
    if(input_size_min.value == "")
    {
      alert("Введіть значення мінімального розміру кульок!(Використовуйте цифри)");
      location.reload();
    }
    else
    {
      let input_size_max = document.querySelector(".input_max_size");
      if(input_size_max.value == "")
      {
        alert("Введіть значення максимального розміру кульок!(Використовуйте цифри)");
        location.reload();
      }
      else
      {

        let speedb = +input_speed.value;
        let min_size = +input_size_min.value;
        let max_size = +input_size_max.value;
        // create n balls
        for(let i=0; i < n; i++) {
          const b = {
            x: w/2,
            y: h/2,
            min_size_b: min_size,
            max_size_b: max_size,
            speed_b: speedb,
            radius: min_size + max_size * Math.random(), // between 5 and 35
            speedX: -(speedb) + speedb * Math.random(), // between -5 and + 5
            speedY: -(speedb) + speedb * Math.random(), // between -5 and + 5
            color: getARandomColor()
          }
          // add ball b to the array
          ballArray.push(b);
        }
        
      }      
    } 
  }
  // returns the array full of randomly created balls
  return ballArray;
}

function getARandomColor() {
  const colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow'];
  // a value between 0 and color.length-1
  // Math.round = rounded value
  // Math.random() a value between 0 and 1
  let colorIndex = Math.round((colors.length-1) * Math.random()); 
  let c = colors[colorIndex];
  
  // return the random color
  return c;
}

function drawNumberOfBallsAlive(balls) {
  ctx.save();

  ctx.font="30px Arial";
  
  if(balls.length === 0) {
    ctx.fillText("YOU WIN!", 20, 30);
    init(number_enemy++);
  } else if(dead){
    ctx.fillText(player.nickname + " YOU LOSE!", 20, 30);
    number_enemy = 1;
  }
  else{
    ctx.fillText("К-сть куль: "+balls.length+" /" + " Level: " + number_enemy, 20, 30);
  }
  ctx.restore();
}


function drawAllEnemies(enemyArray) {
  enemyArray.forEach(function(b) {
    drawFilledCircle(b);
  });
}


function drawAllBalls(ballArray) {
  ballArray.forEach(function(b) {
    drawFilledCircle(b);
  });
}



function moveAllBalls(ballArray) {
  // iterate on all balls in array
  ballArray.forEach(function(b, index) {
    // b is the current ball in the array
    b.x += b.speedX;
    b.y += b.speedY;
    testCollisionBallWithWalls(b); 
    testCollisionWithPlayer(b, index);
  });
}


function moveEnemy(enemyArray) {
  // iterate on all balls in array
  enemyArray.forEach(function(e) {
    // b is the current ball in the array
    e.x += e.speedX;
    e.y += e.speedY;
    testCollisionBallWithWalls(e); 
    testCollisionEnemyWithPlayer(e);
  });
}

function testCollisionEnemyWithPlayer(e) {
  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     e.x, e.y, e.radius)) {
    dead = true;
  }
}

function testCollisionWithPlayer(b, index) {
  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     b.x, b.y, b.radius)) {
    // we remove the element located at index
    // from the balls array
    // splice: first parameter = starting index
    //         second parameter = number of elements to remove
    balls.splice(index, 1);

  }
}

function testCollisionBallWithWalls(b) {
  // COLLISION WITH VERTICAL WALLS ?
  if((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = w - b.radius;
  } else if((b.x -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = b.radius;
  }
 
  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.y = h - b.radius;
  } else if((b.y -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.Y = b.radius;
  }  
}

function drawFilledRectangle(r) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();
  
  // translate the coordinate system, draw relative to it
  ctx.translate(r.x, r.y);
  
  ctx.fillStyle = r.color;
  // (0, 0) is the top left corner of the monster.
  ctx.fillRect(0, 0, r.width, r.height);
  
  // GOOD practice: restore the context
  ctx.restore();
}

function drawFilledCircle(c) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();
  
  // translate the coordinate system, draw relative to it
  ctx.translate(c.x, c.y);
  
  ctx.fillStyle = c.color;
  // (0, 0) is the top left corner
  ctx.beginPath();
  ctx.arc(0, 0, c.radius, 0, 2*Math.PI);
  ctx.fill();
 
  // GOOD practice: restore the context
  ctx.restore();
}



function togglePause() {
  paused = !paused;
  mainLoop();
}

function local_save(){
  localStorage.setItem('player', JSON.stringify(player));
  localStorage.setItem('balls', JSON.stringify(balls));
  localStorage.setItem('enemy', JSON.stringify(enemy));
  localStorage.setItem('level', number_enemy);

}

function replay(){
  player = JSON.parse(localStorage.getItem('player'));
  balls = JSON.parse(localStorage.getItem('balls'));
  enemy = JSON.parse(localStorage.getItem('enemy'));
  number_enemy = JSON.parse(localStorage.getItem('level'));

  let input_player_name = document.querySelector(".input_name_player");
  input_player_name.value = player.nickname;
  let input_player_size = document.querySelector('.input_size_player');
  input_player_size.value = player.width;
  let input_num_b = document.querySelector('.input_number_balls');
  input_num_b.value = balls.length;
  let input_speed = document.querySelector(".input_speed_balls");
  input_speed.value = balls[0].speed_b;
  let input_size_min = document.querySelector(".input_min_size");
  input_size_min.value = balls[0].min_size_b;
  let input_size_max = document.querySelector(".input_max_size");
  input_size_max.value = balls[0].max_size_b;

  canvas = document.querySelector("#myCanvas");
  w = canvas.width; 
  h = canvas.height;  
  ctx = canvas.getContext('2d');
  dead = false;
  canvas.addEventListener('mousemove', mouseMoved);
  mainLoop();
}

function clearLocalStorage(){
  localStorage.clear();
}

document.addEventListener('keydown', function(e){
  if(e.keyCode == 80) //p
  {
    //pause
    togglePause();
  }
  if(e.keyCode == 83) //s
  {
    //save
    local_save();
    console.log("Saved");

  }
  if(e.keyCode == 82) //r
  {
    //replay
    replay();
    console.log("Replaying");
  }
  if(e.keyCode == 67) //c
  {
    clearLocalStorage();
    console.log("Local Storage cleared");
  }
})