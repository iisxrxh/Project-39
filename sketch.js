var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jerry, jerry_running, jerry_collided;
var ground, invisibleGround,  invisibleGround2, groundImage;

var cheesesGroup, cheeseImage;
var obstaclesGroup,tomhit;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  jerry_running = loadAnimation("jerry.png")
  jerry_collided = loadAnimation("jerryshock.png");
  
  groundImage = loadImage("floor.png");
  
  cheeseImage = loadImage("cheese.png");
 
  tomhit = loadImage("tomhit.png")
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  jerry = createSprite(50,100,20,50);
  jerry.addAnimation("running", jerry_running);
  jerry.addAnimation("collided" ,jerry_collided);
  jerry.scale = 1;
  


  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,110);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,160,400,10);
  invisibleGround.visible = false;
  
    invisibleGround2 = createSprite(200,10,400,10);
  invisibleGround2.visible = false;
  
  //create Obstacle and Cheese Groups
  obstaclesGroup = createGroup();
  cheesesGroup = createGroup();
  
  console.log("Hello" + 5);
  
  jerry.setCollider("rectangle",0,0,jerry.width, jerry.height);
  jerry.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  fill("black")
  text("Score: "+ score, 500,50);
  
  
  //console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(3+3*score/100);

  //camera.position.x = jerry.x
  //camera.position.y = jerry.y
    //scoring
    if(jerry.isTouching(cheesesGroup)){
      cheesesGroup.destroyEach();
      score = score+1;

      
    }

    
    // play sound for every score milestone
    if(score>0 && score% 5 === 0){
      checkPointSound.play();
      console.log(ground.velocityX)
      
      }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")  ) {
        jerry.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    jerry.velocityY = jerry.velocityY + 0.8
  
    //spawn the cheeses
    spawnCheeses();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
            if(obstaclesGroup.isTouching(jerry)){
        gameState = END;
        dieSound.play();
      
      
      
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
      text("Score: "+ score, 280,140);
      fill("black")
      ground.velocityX = 0;
      jerry.velocityY = 0
     
      //change the jerry animation
      jerry.changeAnimation("collided", jerry_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cheesesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cheesesGroup.setVelocityXEach(0);
   }
  
 
  //stop jerry from falling down

    jerry.collide(invisibleGround);
    jerry.collide(invisibleGround2);
  
    if(mousePressedOver(restart) && gameState === END) {
      reset();
    }
 
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,135,10,40);
   obstacle.velocityX = -(5+3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(tomhit);
              break;
      case 2: obstacle.addImage(tomhit);
              break;
 
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnCheeses() {
  //write code here to spawn the cheeses
  if (frameCount % 60 === 0) {
     cheese = createSprite(600,100,40,10);
    cheese.y = Math.round(random(10,60));
    cheese.addImage(cheeseImage);
    cheese.scale = 0.5;
    cheese.velocityX = -3;
    
     //assign lifetime to the variable
    cheese.lifetime = 300;
    
    //adjust the depth
    cheese.depth = jerry.depth;
    jerry.depth = jerry.depth + 1;
    
    //adding cheese to the group
   cheesesGroup.add(cheese);
    }
}
function reset(){
  score= 0;
  obstaclesGroup.destroyEach();
  cheesesGroup.destroyEach();
  gameState = PLAY;
  jerry.changeAnimation("running" ,jerry_running);
  
  
}


