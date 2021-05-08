

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, sun, sunImg, background1, backgroundImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

var trexBirdImage, trexBird, trexBirdGroup
var sunImg, sun

function preload() {

  sunImg = loadImage("sun.png")
  trex_running = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");


  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  trexBirdImage = loadImage("trex bird.png")
  backgroundImg = loadImage("backgroundImg.png")
  sunImg = loadImage("sun.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
  console.log(message)

  sun = createSprite(250, 150, 10, 10)
  sun.addImage("sun", sunImg)
  sun.scale = 0.5

  background1 = createSprite(500, 300, windowWidth, windowHeight)
  background1.addImage("background", backgroundImg)

  background1.scale = 90

  ground = createSprite(width / 2, height - 60, width, 20);
  ground.addImage("ground", groundImage);
  ground.scale = 1.2
  // ground.x = width /2;


  trex = createSprite(100, height - 85, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  //trex.debug=true
  trex.scale = 0.15;

  gameOver = createSprite(width / 2, height / 2);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2 + 100);
  restart.addImage(restartImg);
  restart.scale = 0.2;

  gameOver.scale = 2.5;


  invisibleGround = createSprite(200, height - 70, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle,trexBird and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  trexBirdGroup = createGroup()

  trex.setCollider("rectangle", 0, 0, trex.width - 5, trex.height - 20);


  score = 0;

  trex.depth = gameOver.depth
  trex.depth = trex.depth + 1

  sun = createSprite(150, 150, 20, 20)
  sun.addImage("sun", sunImg)
  sun.scale = 0.5
  
  trex.depth=sun.depth
  trex.depth=trex.depth+1

}

function draw() {

  background(0)



  if (gameState === PLAY) {
    cloudsGroup.depth = obstaclesGroup.depth
    obstaclesGroup.depth = obstaclesGroup.depth + 1
    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }
    // console.log()
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    //console.log(trex.y)
    //jump when the space key is pressed
    if ((touches.length > 0 || keyDown("space")) && trex.y > height - 200) {
      trex.velocityY = -27;
      jumpSound.play();
      touches = []

    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.7

    //spawn the clouds
    spawnClouds();

    if (score < 10000) {
      //spawn obstacles on the ground
      spawnObstacles();
    }
    if (score >= 10000) {
      spawnBird()
    }
    if (obstaclesGroup.isTouching(trex) || trexBirdGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);



    ground.velocityX = 0;
    trex.velocityY = 0


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    trexBirdGroup.setLifetimeEach(-1);

    cloudsGroup.setLifetimeEach(-1);
    trexBirdGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }


  //stop trex from falling down
  trex.collide(invisibleGround);

  if (mousePressedOver(restart) && gameState == END) {
    reset();
  }


  drawSprites();
  //displaying score
  fill("black")
  stroke("red")
  textFont("Comic Sans Ms")
  strokeWeight(11)
  textSize(100)
  text("Score: " + score, width / 2 - 200, height - 500);

}

function reset() {
  score = 0
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  gameState = PLAY
  trex.changeAnimation("running", trex_running)
  trexBirdGroup.destroyEach()
}


function spawnObstacles() {
  if (frameCount % 150 === 0) {
    var obstacle = createSprite(width, height - 227, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: {
        obstacle.addImage(obstacle1);
        obstacle.scale = 1.3;
        obstacle.setCollider("rectangle", 0, 0, 150, 120)
        break;
      }
      case 2: {
        obstacle.addImage(obstacle2);
        obstacle.scale = 1.3;
        obstacle.setCollider("rectangle", 0, 0, 180, 150)
        break;
      }
      case 3: {
        obstacle.addImage(obstacle3);
        obstacle.scale = 0.5;
        obstacle.setCollider("rectangle", 0, 20, 500, 200)
        break;
      }
      case 4: {
        obstacle.addImage(obstacle4);
        obstacle.scale = 0.5;
        obstacle.setCollider("rectangle", 0, 40, 500, 200)
        break;
      }

      default: break;
    }

    //assign scale and lifetime to the obstacle           

    obstacle.lifetime = 300;
    //obstacle.debug=true

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(100, height - 200));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    cloud.depth = gameOver.depth
    gameOver.depth = gameOver.depth + 1
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
    restart.depth = cloud.depth
    cloud.depth = cloud.depth + 1

  }
}

function spawnBird() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    trexBird = createSprite(600, 120, 40, 10);
    trexBird.y = Math.round(random(height - 100));
    trexBird.addImage(trexBirdImage);
    trexBird.scale = 0.25;
    trexBird.velocityX = -(6 + score / 1000);

    //assign lifetime to the variable
    trexBird.lifetime = 200;

    //adjust the depth
    trexBird.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    trexBirdGroup.add(trexBird);
  }
}

