var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var backgroundImg;

var score=0;

var gameOver, restart;

var birdsGroup,birdImage;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("images/trex1.png","images/trex3.png","images/trex4.png");
  trex_collided = loadAnimation("images/trex_collided.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");

  birdImage = loadImage("images/bird.jpeg");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");

  backgroundImg=loadImage("images/backgroundImg.png")
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  canvas = createCanvas(displayWidth-20,displayHeight-30);
  
  trex = createSprite(50,600,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,680,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible= false;

  gameOver = createSprite(700,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,440);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,610,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdsGroup = new Group();
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  text("Score: "+ score, 1200,140);
  text("Note:Do not touch obstacle and cloud",600,50)
  text("& Press space or up arrow to play.",600,70)

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    if(keyDown("UP_ARROW") && trex.y >= 159) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

    if(cloudsGroup.isTouching(trex)) {
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);


    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,620,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1500,585,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

/*function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var bird = createSprite(620,640,40,10);
    bird.y = Math.round(random(80,120));
    bird.addImage(birdImage);
    bird.scale = 0.5;
    bird.velocityX = -3;
    
     //assign lifetime to the variable
    bird.lifetime = 200;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    birdsGroup.add(bird);
  }
  
}*/

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}