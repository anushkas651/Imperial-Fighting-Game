const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');
let hit = document.querySelector('canvas');

canvas.width = 850;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let bg = new Audio('./audio/bg.mp3');
bg.autoplay=true;

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png',
  scale: 0.65
});

const player = new Fighter({
  position: {
    x: 80,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/hero/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 135
  },
  sprites: {
    idle: {
      imageSrc: './img/hero/Idle.png',
      framesMax: 11
    },
    run: {
      imageSrc: './img/hero/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/hero/Jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/hero/Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/hero/Attack1.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: './img/hero/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/hero/Death.png',
      framesMax: 11
    }
  },
  attackBox: {
    offset: {
      x: -20,
      y: 50
    },
    width: 160,
    height: 50
  }
});

const enemy = new Fighter({
  position: {
    x: 700,
    y: 150
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: './img/wiz/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 265,
    y: 266
  },
  sprites: {
    idle: {
      imageSrc: './img/wiz/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/wiz/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/wiz/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/wiz/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/wiz/Attack.png',
      framesMax: 8
    },
    takeHit: {
      imageSrc: './img/wiz/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/wiz/Dea.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
});

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
};
def();
setInterval(()=>{def();}, 7000);
decreaseTimer();
function def(){
  if(!enemy.dead) {
    setTimeout(() => {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
    }, 0);
    setTimeout(() => {
      enemy.attack();
    }, 1000);
    setTimeout(() => {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
    }, 1500);
    setTimeout(() => {
      enemy.attack();
    }, 1600);
    setTimeout(() => {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
    }, 3000);
    setTimeout(() => {
        if (enemy.position['y'] > 100) enemy.velocity.y = -20;
      },
      3000);
    setTimeout(() => {
      enemy.attack();
    }, 3800);
    setTimeout(() => {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
    }, 4500);
    setTimeout(() => {
      enemy.attack();
    }, 4500);
    setTimeout(() => {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
    }, 5000);
    setTimeout(() => {
      enemy.attack();
    }, 5200);
    setTimeout(() => {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
    }, 7000);
    setTimeout(() => {
      enemy.attack();
    }, 5600);
    setTimeout(() => {
      enemy.attack();
    }, 6200);
  }
}
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    if (player.position['x']>25) player.velocity.x = -6;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    if (player.position['x']<790) player.velocity.x = 6;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if (enemy.position['x']>25) enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if (enemy.position['x']<770) enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    });
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to('#playerHealth', {
      width: player.health + '%'
    });
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        if (player.position['y']>100) player.velocity.y = -20;
        break;
      case ' ':
        player.attack();
        break;
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
})


