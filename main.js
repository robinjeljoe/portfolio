const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;


coinImage = new Image();
coinImage.src = './assets/coin.png';


const assetsToLoad = [
  { name: "help", src: "./assets/help.png" },
  { name: "s1", src: "./assets/s1.png" },
  { name: "s2", src: "./assets/s2.png" },
  { name: "c1", src: "./assets/c1.png" },
  { name: "c2", src: "./assets/c2.png" },
  { name: "sign", src: "./assets/sign.png" },
  { name: "spriteSheet", src: "./3 Dude_Monster/Dude_Monster_Idle_4.png" },
  { name: "letter1", src: "./assets/letter1.png" },
  { name: "letter2", src: "./assets/letter2.png" },
  { name: "letter3", src: "./assets/phone.png" },
  { name: "letter", src: "./assets/letter.png" },
  { name: "ps", src: "./assets/projectsign.png" },
  { name: "pf", src: "./assets/portfolio.png" },
  // Add all other assets you use
];

const loadedAssets = {};
let assetsLoaded = 0;

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.frameCount = 15;
    this.frameWidth = 16;
    this.frameHeight = 16;
    this.radius = 16; // for hitbox
    this.collected = false;
    this.frameTimer = 0;
    this.frameInterval = 100; // ms between frames
  }

  update(deltaTime) {
    if (this.collected) return;
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameInterval) {
      this.frame = (this.frame + 1) % this.frameCount;
      this.frameTimer = 0;
    }
  }

  draw(ctx, cameraX) {
    if (this.collected || !coinImage.complete) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      coinImage,
      this.frame * this.frameWidth,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x - cameraX - this.radius - 10,
      this.y - this.frameHeight / 2 - 50,
      this.frameWidth*3,
      this.frameHeight*3
    );
  }

  checkCollision(player) {
    if (
      !this.collected &&
      player.x < this.x + this.radius &&
      player.x + player.width > this.x - this.radius &&
      player.y < this.y + this.radius &&
      player.y + player.height > this.y - this.radius
    ) {
      this.collected = true;
      player.score++;
      sfx.coin.currentTime = 0;
  sfx.coin.play();
      // Optional: play coin sound
    }
  }
}


let lastTime = 0;



const bgMusic = new Audio('./assets/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const sfx = {
  jump: new Audio('./assets/jump.mp3'),
  run: new Audio('./assets/run.mp3'),
  teleport: new Audio('./assets/portal.mp3'),
  bonus: new Audio('./assets/bonus.wav'),
  coin: new Audio('./assets/coin.wav')
};

sfx.bonus.volume = 0.5;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if(window.innerHeight > window.innerWidth){ 
      document.getElementById("gameCanvas").style.display = "none";
      document.getElementById("scrollBox2").style.display = "block";
    }
    else{
    var xfactor = 1536/window.innerWidth;
    var yfactor = 768/window.innerHeight;
    document.getElementById("scrollBox2").style.display = "none";
    document.getElementById("scrollBox").style.width = 550/xfactor + 'px';
    document.getElementById("scrollBox").style.height = 410/yfactor + 'px';
    document.getElementById("scrollBox").style.left = 470/xfactor + 'px';
    document.getElementById("scrollBox").style.top = 80/yfactor + 'px';
    document.getElementById("scrollBox1").style.width = 435/xfactor + 'px';
    document.getElementById("scrollBox1").style.height = 455/yfactor + 'px';
    document.getElementById("scrollBox1").style.left = 520/xfactor + 'px';
    document.getElementById("scrollBox1").style.top = 120/yfactor + 'px';
    }
  }

  // Initial resize
  resizeCanvas();

  // Resize canvas when the window is resized
  window.addEventListener('resize', resizeCanvas);


// Game constants
const gravity = 0.2;
const groundY = 400;

let cameraX = 0;
const screenCenterX = 700;

var xfactor = (1536/window.innerWidth);
var yfactor = (768/window.innerHeight);

// Load images

const backgroundWorlds = {
  world1: [
    { image: new Image(), speedFactor: 0.2 },
    { image: new Image(), speedFactor: 0.4 },
    { image: new Image(), speedFactor: 0.6 },
    { image: new Image(), speedFactor: 0.8 }
  ],
  world2: [
    { image: new Image(), speedFactor: 0.2 },
    { image: new Image(), speedFactor: 0.4 },
    { image: new Image(), speedFactor: 0.6 },
    { image: new Image(), speedFactor: 0.8 }
  ],
  world3: [
    { image: new Image(), speedFactor: 0.2 },
    { image: new Image(), speedFactor: 0.4 },
    { image: new Image(), speedFactor: 0.6 },
    { image: new Image(), speedFactor: 0.8 }
  ],
  world4: [
    { image: new Image(), speedFactor: 0.2 },
    { image: new Image(), speedFactor: 0.4 },
    { image: new Image(), speedFactor: 0.6 },
    { image: new Image(), speedFactor: 0.8 }
  ]
};

// Assign sources
backgroundWorlds.world1[0].image.src = './assets/Layers/sky.png';
backgroundWorlds.world1[1].image.src = './assets/Layers/clouds_bg.png';
backgroundWorlds.world1[2].image.src = './assets/Layers/glacial_mountains.png';
backgroundWorlds.world1[3].image.src = './assets/Layers/clouds_mg_2.png';

backgroundWorlds.world2[0].image.src = './assets/dawn/Layers/back.png';
backgroundWorlds.world2[1].image.src = './assets/dawn/Layers/middle.png';
backgroundWorlds.world2[2].image.src = './assets/dawn/Layers/middle.png';
backgroundWorlds.world2[3].image.src = './assets/dawn/Layers/front.png';

backgroundWorlds.world4[0].image.src = './assets/city/city 7/1.png';
backgroundWorlds.world4[1].image.src = './assets/city/city 7/3.png';
backgroundWorlds.world4[2].image.src = './assets/city/city 7/4.png';
backgroundWorlds.world4[3].image.src = './assets/Layers/clouds_mg_2.png';

backgroundWorlds.world3[0].image.src = './assets/pfg/08_Forest.png';
backgroundWorlds.world3[1].image.src = './assets/pfg/06_Forest.png';
backgroundWorlds.world3[2].image.src = './assets/pfg/04_Forest.png';
backgroundWorlds.world3[3].image.src = './assets/mist.png';

let currentWorld = 'world1';
let targetWorld = 'world1';
let fadeOpacity = 0;
let fading = false;
let fadeDirection = 1; // 1 = fade out, -1 = fade in


function updateWorldState() {
  if (player.x >= 0 && player.x < 2000) {
    if (currentWorld !== 'world1' && !fading) {
      startFadeTransition('world1');
    }
  } else if (player.x >= 2000 && player.x < 4000) {
    if (currentWorld !== 'world2' && !fading) {
      startFadeTransition('world2');
    }
  } else if (player.x >= 4000 && player.x < 6000) {
    if (currentWorld !== 'world3' && !fading) {
      startFadeTransition('world3');
    }
  }
  else if (player.x >= 6000 && player.x < 8000) {
    if (currentWorld !== 'world4' && !fading) {
      startFadeTransition('world4');
    }
  }
}

function startFadeTransition(newWorld) {
  targetWorld = newWorld;
  fading = true;
  fadeDirection = 1;
}

function drawFadeTransition() {
  if (!fading) return;

  // Apply fade overlay
  ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update opacity
  fadeOpacity += 0.02 * fadeDirection;

  if (fadeOpacity >= 1 && fadeDirection === 1) {
    // Fully faded out, switch world
    currentWorld = targetWorld;
    fadeDirection = -1;
  }

  if (fadeOpacity <= 0 && fadeDirection === -1) {
    fading = false;
    fadeOpacity = 0;
  }
}


const platform = new Image();
platform.src = './assets/1.png';

const platformTextures = {
            default: new Image(),
            type1: new Image(), // Example: grassy platform
            type2: new Image(),
            portfolio: new Image(),
            about: new Image(),
            contact: new Image(),
            projects: new Image(), // Example: stone platform
            invisible: new Image(),
            projectsign: new Image(),
            projecttile: new Image(),
            bf1: new Image(),
            bf2: new Image(),
            sortem: new Image() // For invisible walls/boundaries
        };

        // Paths to your platform textures
        // Replace these with your actual asset paths
        platformTextures.default.src = 'https://placehold.co/140x40/A0522D/FFFFFF?text=Platform+1'; 
        platformTextures.default.onerror = () => { platformTextures.default.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
        
        platformTextures.type1.src = './assets/grass.png'; 
        platformTextures.type1.onerror = () => { platformTextures.type1.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }

        platformTextures.type2.src = './assets/stone.png';
        platformTextures.type2.onerror = () => { platformTextures.type2.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }

        platformTextures.portfolio.src = './assets/portfolio.png';
        platformTextures.portfolio.onerror = () => { platformTextures.portfolio.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
    
        platformTextures.about.src = './assets/about.png';
        platformTextures.about.onerror = () => { platformTextures.about.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
    
        platformTextures.contact.src = './assets/contacts.png';
        platformTextures.contact.onerror = () => { platformTextures.contact.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
        
        platformTextures.sortem.src = './assets/sortem.png';
        platformTextures.sortem.onerror = () => { platformTextures.sortem.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }

        platformTextures.projectsign.src = './assets/projectsign.png';
        platformTextures.projectsign.onerror = () => { platformTextures.projectsign.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }

        platformTextures.projecttile.src = './assets/projecttile.png';
        platformTextures.projecttile.onerror = () => { platformTextures.projecttile.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
        
        platformTextures.projects.src = './assets/projects.png';
        platformTextures.projects.onerror = () => { platformTextures.projects.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
        
        platformTextures.bf1.src = './assets/bf1.png';
        platformTextures.bf1.onerror = () => { platformTextures.bf2.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }
        
        platformTextures.bf2.src = './assets/bf2.png';
        platformTextures.bf2.onerror = () => { platformTextures.bf2.src = 'https://placehold.co/140x40/FF0000/FFFFFF?text=Error'; }

        // For invisible walls, we can use a transparent placeholder or not draw it if a special textureKey is used
        // Here, using a placeholder for clarity that it's an "invisible" texture, though it won't be drawn.
        platformTextures.invisible.src = 'https://placehold.co/1x1/FFFFFF/FFFFFF?text=_'; // 1x1 transparent essentially

const platforms = [
    { x: 0, y: 0, width: 40, height: 780,tex:'invisible',coin: false },
    { x: 6000/xfactor, y: 0, width: 40, height: 780,tex:'invisible',coin: false },
    { x: 7100/xfactor, y: 0, width: 40, height: 780,tex:'invisible',coin: false },
    { x: 8500/xfactor, y: 0, width: 40, height: 780,tex:'invisible',coin: false },
  { x: 0, y: 601/yfactor, width: 12000, height: 600,tex:'invisible',coin: false },
  { x: 300/xfactor, y: 400/yfactor, width: 150, height: 60, tex:'type1',coin: false },
  { x: 900/xfactor, y: 420/yfactor, width: 140, height: 60, tex:'about',letteron:1,coin: true },
  { x: 1100/xfactor, y: 410/yfactor, width: 140, height: 60, tex:'projects',teleportTo:{x: 2300/xfactor, y: 430/yfactor}, coin: true },
  { x: 1300/xfactor, y: 430/yfactor, width: 140, height: 60, tex:'contact',teleportTo:{x: 4330/xfactor, y: 250/yfactor},coin: true },
  
  { x: 2900/xfactor, y: 420/yfactor, width: 150, height: 70, tex:'projecttile', coin: true },
  { x: 3100/xfactor, y: 290/yfactor, width: 170, height: 70, tex:'projecttile',letteron:3 ,coin: false },
  { x: 3300/xfactor, y: 290/yfactor, width: 170, height: 70, tex:'projecttile' ,letteron:4, coin: false },
  { x: 3500/xfactor, y: 420/yfactor, width: 150, height: 70, tex:'projecttile' , coin: true },
  { x: 4900/xfactor, y: 420/yfactor, width: 140, height: 50, tex:'bf2',coin: true },
  { x: 5100/xfactor, y: 290/yfactor, width: 270, height: 80, tex:'bf1' ,coin: false,letteron:2 },
  { x: 5500/xfactor, y: 290/yfactor, width: 270, height: 80, tex:'bf1',teleportTo:{x: 330/xfactor, y: 250/yfactor} ,coin: false },
  { x: 5800/xfactor, y: 420/yfactor, width: 140, height: 50, tex:'bf2' ,coin: true },
  { x: 7500/xfactor, y: 420/yfactor, width: 270, height: 80, tex:'bf1' ,coin: false },
];

const coins = [];
platforms.forEach(platform => {
  // Place one coin centered on each platform
  if(platform.coin){
  const coinX = platform.x + platform.width / 2;
  const coinY = platform.y - 20; // slightly above platform
  coins.push(new Coin(coinX, coinY));
  }
});

 

// Player object
const player = {
  x: 330/xfactor,
  y: 250/yfactor,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  isX: false,
  speed: 1,
  scale:4,
  isEsc: false,
  jumping: false,
  frameX: 0,
  score: 0,
  frameY: 0,
  letteroner: 0,
  facingRight: true,
  downer: false,
  frameDelay: 15,
  frameCount: 0,
  currentFrameSet: 'idle',
  animations: {
    idle: { y: 0, frames: 4, src: './3 Dude_Monster/Dude_Monster_Idle_4.png' },
    walk: { y: 0, frames: 6, src: './3 Dude_Monster/Dude_Monster_Walk_6.png' },
    gaywalk: { y: 0, frames: 6, src: './3 Dude_Monster/Dude_Monster_RevWalk_6.png' },
    run:  { y: 0, frames: 6, src: './3 Dude_Monster/Dude_Monster_Run_6.png' },
    jump: { y: 0, frames: 8, src: './3 Dude_Monster/Dude_Monster_Jump_8.png' }
  }
};

// Input
const keys = {};

const linkText = "Linkedin";
const linkX = 660/xfactor;
const linkY = 610/yfactor;
const linkURL = "https://www.linkedin.com/in/robinjeljoe";
let linkVisible = false;

function drawLink() {
  ctx.fillStyle = "blue";
  ctx.font = "50px Times New Roman";
  ctx.fillText(linkText, linkX, linkY);
  ctx.beginPath();
  const textWidth = ctx.measureText(linkText).width;
  ctx.moveTo(linkX, linkY + 5);
  ctx.lineTo(linkX + textWidth, linkY + 5);
  ctx.strokeStyle = "blue";
  ctx.stroke();

  if (!linkVisible) {
    enableLinkListeners();
    linkVisible = true;
    
  }
}

function hideLink() {
  if (linkVisible) {
    disableLinkListeners();
    linkVisible = false;
    document.getElementById("scrollBox").style.display = "none";
    document.getElementById("scrollBox1").style.display = "none";
  }
}



document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function updatePlayer() {

  // Movement
  const isRight = keys['d'] || keys['D'] || keys['ArrowRight'];
  const isLeft = keys['a'] || keys['A'] || keys['ArrowLeft'];
  const isShift = keys['Shift'];
  const isDown = keys['s'] || keys['S'] || keys['ArrowDown'];
  const isX = keys['x'] || keys['X'];
  const isEsc = keys['Escape'];

  player.speed = isShift ? 2.5 : 1.5;
  player.letteroner = 0;
  if (isRight) {
    player.vx = player.speed;
    player.facingRight = true;
    changeAnimation(isShift ? 'run' : 'walk');
  } else if (isLeft) {
    player.facingRight = false;
    player.vx = -player.speed;
    changeAnimation(isShift ? 'run' : 'walk');
  } else {
    player.vx = 0;
    changeAnimation('idle');
  }

  if ((keys[' '] || keys['Space'] || keys['W'] || keys['w'] || keys['ArrowUp']) && !player.jumping) {
    player.vy = -9+(yfactor-1.15);
    player.jumping = true;
    sfx.jump.currentTime = 0;
  sfx.jump.play();
    changeAnimation('jump');
  }
  if(isDown){
    player.downer = true;
    
  }
  if(isX){
    player.isX = true;
  }
  if(isEsc){
    player.isEsc = true;
  }
  // Apply gravity and movement

  let onGround = false;

  // Apply vertical velocity
  player.vy += gravity;
  player.y += player.vy;
  player.height = (32 * 3)*xfactor;
  player.width = (32 * 3)*yfactor;

  // Vertical Collision (top + bottom)
  for (const platform of platforms) {
    const isOverlappingX = player.x + player.width > platform.x &&
                           player.x < platform.x + platform.width;

    if (isOverlappingX) {
      // Landing on top
      const isFalling = player.vy >= 0;
      const wasAbove = player.y + player.height - player.vy <= platform.y;
      const isNowTouching = player.y + player.height > platform.y &&
                            player.y < platform.y + platform.height;

      if (isFalling && wasAbove && isNowTouching) {
      // Landed on platform
      player.y = platform.y - player.height;
      player.vy = 0;
      player.jumping = false;
      onGround = true;

      if((platform.letteron!=0)&&player.downer!=0){
        platform.stayTime = (platform.stayTime || 0) + 1; // count frames
        if(platform.stayTime == 40){
          sfx.bonus.currentTime = 0;
  sfx.bonus.play();
        }
        // 5 seconds = 5 × 60 frames (assuming 60fps)
        if (platform.stayTime >= 60 * 1) {
          
          player.letteroner = platform.letteron;
        }
      }
      if (isEsc){
        platform.stayTime = 0;
        player.letteroner = 0;
        player.downer = false;
      }

      // ⏱️ Check for teleport logic
      if (platform.teleportTo && player.downer==true) {
        platform.stayTime = (platform.stayTime || 0) + 1; // count frames
        sfx.teleport.currentTime = 0;
  sfx.teleport.play();
        // 5 seconds = 5 × 60 frames (assuming 60fps)
        if (platform.stayTime >= 60 * 3) {
          
          player.x = platform.teleportTo.x;
          player.y = platform.teleportTo.y;
          player.vx = 0;
          player.vy = 0;
          platform.stayTime = 0;
          player.downer = false; // reset after teleport
          break;
        }
      }
    } else if (platform.teleportTo) {
      // Not standing on it anymore — reset timer
      platform.stayTime = 0;
    }
    const isJumpingUp = player.vy < 0;
      const wasBelow = player.y - player.vy >= platform.y + platform.height;
      const isTouchingBottom = player.y < platform.y + platform.height &&
                               player.y + player.height > platform.y;

      if (isJumpingUp && wasBelow && isTouchingBottom) {
        player.y = platform.y + platform.height;
        player.vy = 0;
      }
  } else if (platform.teleportTo) {
    // Not even overlapping — reset timer
    platform.stayTime = 0;
  }
  }

  // Apply horizontal velocity
  player.x += player.vx;

  // Horizontal Collision (left + right)
  for (const platform of platforms) {
    const isOverlappingY = player.y + player.height > platform.y &&
                           player.y < platform.y + platform.height;

    if (isOverlappingY) {
      // Hit from left
      const isMovingRight = player.vx > 0;
      const wasLeft = player.x + player.width - player.vx <= platform.x;
      const isTouchingLeft = player.x + player.width > platform.x &&
                             player.x < platform.x + platform.width;

      if (isMovingRight && wasLeft && isTouchingLeft) {
        player.x = platform.x - player.width;
        player.vx = 0;
      }

      // Hit from right
      const isMovingLeft = player.vx < 0;
      const wasRight = player.x - player.vx >= platform.x + platform.width;
      const isTouchingRight = player.x < platform.x + platform.width &&
                              player.x + player.width > platform.x;

      if (isMovingLeft && wasRight && isTouchingRight) {
        player.x = platform.x + platform.width;
        player.vx = 0;
      }
    }
  }

  // Handle camera scroll (optional)
  if (player.x > screenCenterX) {
    cameraX = player.x - screenCenterX;
  } else {
    cameraX = 0;
  }

  // Optional: restrict to floor (fallback)
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.vy = 0;
    player.jumping = false;
    onGround = true;
  }

  // Set jump state
  player.onGround = onGround;

}

function changeAnimation(name) {
  if (player.currentFrameSet !== name) {
    player.currentFrameSet = name;
    spriteSheet.src = player.animations[name].src;
    player.frameX = 0;
    player.frameCount = 0;
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
function drawParallaxRange(startIndex, endIndex) {
  const layers = backgroundWorlds[currentWorld];
  for (let i = startIndex; i <= endIndex; i++) {
    const layer = layers[i];
    const offsetX = -cameraX * layer.speedFactor;
    const img = layer.image;
    
    // Skip if image not loaded
    if (!img.complete) continue;
    
   const tileWidth = canvas.width * 0.5; // Custom width (scale factor)
    const repeatCount = Math.ceil(canvas.width / tileWidth) + 2;

    for (let j = 0; j < repeatCount; j++) {
      const drawX = Math.floor((offsetX % tileWidth) + j * tileWidth);
      ctx.drawImage(img,0,0,img.width - 1, img.height, drawX, 0, tileWidth, canvas.height);
    }
  }
}





function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateWorldState();
  drawParallaxRange(0, 2);
  ctx.drawImage(help, 0-cameraX , 0, 200, 200);
  ctx.drawImage(s1, (3050/xfactor)-cameraX , (120/yfactor), 200, 200);
  ctx.drawImage(s2, (3300/xfactor)-cameraX , (120/yfactor), 200, 200);
  ctx.drawImage(c1, (5100/xfactor)-cameraX , (0/yfactor), 300/xfactor, 300/yfactor);
  ctx.drawImage(c2, (5500/xfactor)-cameraX , (0/yfactor), 300/xfactor, 300/yfactor);
  ctx.drawImage(ps, (2300/xfactor)-cameraX , (0/yfactor), 450/xfactor, 300/yfactor);
  ctx.drawImage(pf, (950/xfactor)-cameraX , (80/yfactor), 450/xfactor, 140/yfactor);
  ctx.drawImage(sign, 800-cameraX , -50, 300, 300);
  // Draw ground/platform
   for (const p of platforms) {
    if (p.tex === 'invisible') continue; 
    const textureToDraw = platformTextures[p.tex] || platformTextures.default;
    ctx.drawImage(textureToDraw, p.x - cameraX, p.y, p.width, p.height);
  }
  const drawOffsetX = (player.scale*32 - player.width) / 2;  // adjust X
const drawOffsetY = (player.scale*32 - player.height);     // adjust Y to move sprite bottom down to match

  
  // Draw player
  const anim = player.animations[player.currentFrameSet];
  let drawX = (player.x > screenCenterX ? screenCenterX : player.x - cameraX)- drawOffsetX;
  let drawY = player.y - drawOffsetY ;
  let drawWidth = 32 * player.scale;
  let drawHeight = 32 * player.scale;
  

  ctx.save(); 
  if (!player.facingRight) {
    ctx.translate(drawX + drawWidth / 2, 0);  // Move to flip origin
    ctx.scale(-1, 1);                         // Flip horizontally
    drawX = -drawWidth / 2;                   // Adjust drawX since we're flipped
  }
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    spriteSheet,
    player.frameX * 32, 0, 32, 32,            // Source sprite
    player.facingRight ? drawX : drawX,       // Destination X (adjusted if flipped)
    drawY,
    drawWidth, drawHeight
  );
  
  //ctx.strokeStyle = 'red';
//ctx.strokeRect(player.x - cameraX, player.y, player.width*player.scale, player.height*player.scale);
//drawPlatformHitboxes();
  ctx.restore();
  
  drawParallaxRange(3, 3);
  drawTeleportProgressBars();
  drawletterProgressBars();
  drawFadeTransition();
  
  //ctx.drawImage(coinImage,0,0,16,16, 10/xfactor, 685/yfactor, 50, 50);
  //ctx.fillStyle = "white";  
//ctx.font = "35px Arial";
//ctx.fillText(" : " + player.score, 60/xfactor, 720/yfactor);

}
function drawPlatformHitboxes() {
  ctx.strokeStyle = 'limegreen';
  ctx.lineWidth = 1;

  for (const platform of platforms) {
    ctx.strokeRect(
      platform.x - cameraX,
      platform.y,
      platform.width,
      platform.height
    );
  }
}

function animateSprite() {
  player.frameCount++;
  const anim = player.animations[player.currentFrameSet];
  if (player.frameCount >= player.frameDelay) {
    player.frameX = (player.frameX + 1) % anim.frames;
    player.frameCount = 0;
  }
}

function drawTeleportProgressBars() {
  for (const platform of platforms) {
    if (platform.teleportTo && platform.stayTime > 0) {
      const barWidth = platform.width;
      const barHeight = 6;
      const progress = Math.min(platform.stayTime / (60 * 3), 1); // 0 to 1
      
      const x = platform.x - cameraX;
      const y = platform.y - 12; // above the platform

      // Background bar
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Progress bar
      ctx.fillStyle = 'limegreen';
      ctx.fillRect(x, y, barWidth * progress, barHeight);

      // Optional border
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, y, barWidth, barHeight);
    }
  }
}
function drawletterProgressBars() {
  for (const platform of platforms) {
    if (platform.letteron && platform.stayTime > 0) {
      const barWidth = platform.width;
      const barHeight = 6;
      const progress = Math.min(platform.stayTime / (60 * 1), 1); // 0 to 1
      
      const x = platform.x - cameraX;
      const y = platform.y - 12; // above the platform

      // Background bar
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Progress bar
      ctx.fillStyle = 'limegreen';
      ctx.fillRect(x, y, barWidth * progress, barHeight);

      // Optional border
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, y, barWidth, barHeight);
    }
  }
}

function gameLoop(timestamp) {
  updatePlayer();
  draw();
  animateSprite();
  checkcoins(timestamp);
  drawletter();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
  if (bgMusic.paused) {
    bgMusic.play();
  }
})

function enableLinkListeners() {
  canvas.addEventListener("click", handleLinkClick);
  canvas.addEventListener("mousemove", handleLinkHover);
}

function disableLinkListeners() {
  canvas.removeEventListener("click", handleLinkClick);
  canvas.removeEventListener("mousemove", handleLinkHover);
}

function handleLinkClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const textWidth = ctx.measureText(linkText).width;

  if (x >= linkX && x <= linkX + textWidth && y >= linkY - 20 && y <= linkY + 10) {
    window.open(linkURL, "_blank");
  }
}

function handleLinkHover(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const textWidth = ctx.measureText(linkText).width;

  if (x >= linkX && x <= linkX + textWidth && y >= linkY - 20 && y <= linkY + 10) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
}

function checkcoins(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Update and draw
  coins.forEach(coin => {
    coin.update(deltaTime);
    coin.draw(ctx, cameraX);
    coin.checkCollision(player);
  });

}

function drawletter(){
  if (player.letteroner!=0){
    
      if(player.letteroner===1){
        ctx.drawImage(letter1, 0, 0, canvas.width, canvas.height);
      }
      else if(player.letteroner===2){
        ctx.drawImage(letter2, 0, 0, canvas.width, canvas.height);
        drawLink();
      }
      else if(player.letteroner===3){
        document.getElementById("scrollBox").style.display = "block";
        ctx.drawImage(letter, 0, 0, canvas.width, canvas.height);
      }
      else if(player.letteroner===4){
        document.getElementById("scrollBox1").style.display = "block";
        ctx.drawImage(letter3, 0, 0, canvas.width, canvas.height);
      }
    
    
    
  }
  else{
    document.getElementById("scrollBox1").style.display = "none";
    document.getElementById("scrollBox").style.display = "none";
    hideLink();
  }
}

function drawLoadingBar(progress) {
  const barWidth = 500;
  const barHeight = 8;
  const x = canvas.width / 2 - barWidth / 2;
  const y = canvas.height / 2;

  // Background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // "Loading..." text
  ctx.fillStyle = 'white';
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', canvas.width / 2, y - 40);

  // Decorative tip text (optional)
  ctx.font = '16px serif';
  ctx.fillStyle = '#aaaaaa';
  ctx.fillText('"Did you know? You can sprint by holding Shift."', canvas.width / 2, y + 60);

  // Border
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, barWidth, barHeight);

  // Progress bar
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, barWidth * progress, barHeight);
}

function preloadAssets(assets, onComplete) {
  assets.forEach(asset => {
    const img = new Image();
    img.src = asset.src;
    img.onload = () => {
      loadedAssets[asset.name] = img;
      assetsLoaded++;
      const progress = assetsLoaded / assets.length;
      drawLoadingBar(progress);

      if (assetsLoaded === assets.length) {
        onComplete();
      }
    };
  });
}

function startGame() {
  // Assign loaded assets to your variables
  window.help = loadedAssets["help"];
  window.s1 = loadedAssets["s1"];
  window.s2 = loadedAssets["s2"];
  window.c1 = loadedAssets["c1"];
  window.c2 = loadedAssets["c2"];
  window.sign = loadedAssets["sign"];
  window.spriteSheet = loadedAssets["spriteSheet"];
  window.letter1 = loadedAssets["letter1"];
  window.letter2 = loadedAssets["letter2"];
  window.letter = loadedAssets["letter"];
  window.letter3 = loadedAssets["letter3"];
  window.ps = loadedAssets["ps"];
  window.pf = loadedAssets["pf"];
  // Start the game loop

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", () => {
  drawLoadingBar(0);
  preloadAssets(assetsToLoad, startGame);
});