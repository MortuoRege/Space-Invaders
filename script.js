const scoreEl = document.querySelector("#scoreEl"); 
const canva = document.querySelector("canvas"); // note that querySelector is a 
const c = canva.getContext('2d');               //method that selects DOM element 
                                                //of a web page and returns a reference to it
canva.width = 1024;
canva.height = 576;

class Player // a palyer class
{
    constructor()
    {
        this.velocity ={
            x: 0,
            y: 0,
        }
        //this keyword refers to an object itself
        //since player needs to move in x and y directions
        //they are defined as such 

        const image = new Image();//this is built in object that represents an html image
        image.src = './img/spaceship.png';

    image.onload = () => {
        const scale = 0.40;
        this.image = image;
        this.width = image.width *scale;
        this.height = image.height * scale;
        this.position = { 
            x: canva.width/2 - this.width/2,// player will be in the midle of the canvas at the start
            y: canva.height-this.height-20,//-20 is there so player doesn't start exactly at the bottom
        }
        }

        this.rotatation = 0;
        this.opacity = 1;//opacity is used to disapear the player when it get hit
    }

    draw()//this is a draw method **note to self** methods in classes do not need function declaration
    {
        
        c.save()
        c.globalAlpha = this.opacity;
        c.translate(
            player.position.x + player.width/2, 
            player.position.y +player.height/2
            )
        c.rotate(this.rotatation)
        c.translate(
            -player.position.x - player.width/2, 
            -player.position.y - player.height/2
            )

        if(this.image)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        
        c.restore()
    }

    update()// update funtion, updates the position of the player
    {
        if(this.image)//only executes if player image exists
        {
        this.draw();
        this.position.x += this.velocity.x;
        }
    }
}

class Projectile// projectile class 
{
    constructor({position, velocity})//constructor takes in a position and velocity which is updated dynamicly
    {
        this.position = position;
        this.velocity = velocity;

        const image = new Image();
        image.src = './img/bullets.png';
        image.onload = () => {
            const scale = 0.25;
            this.image = image;
            this.width = image.width*scale;
            this.height = image.height*scale;
        }
        

    }

    draw()
    {
       c.beginPath();
       c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2);
       if(this.image)
       c.drawImage(this.image, this.position.x-this.width/2, this.position.y-this.height/2, this.width, this.height);

       c.closePath();
    }
    update()
    {
        this.draw();
        this.position.y += this.velocity.y;
        
    }
}
class InvaderProjectile
{
    constructor({position, velocity})//constructor takes in a position and velocity which is updated dynamicly
    {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;

    }

    draw()
    {
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update()
    {
        this.draw();
        this.position.y += this.velocity.y;
        
    }
}
class Invader//invader class 
{
    constructor({position})
    {
        this.velocity ={
            x: 0,
            y: 0,
        }

        const image = new Image();
        image.src = './img/attacker.png';

    image.onload = () => {
        const scale = 0.20;
        this.image = image;
        this.width = image.width *scale;
        this.height = image.height * scale;
        this.position = { 
            x: position.x,
            y: position.y,
        }
        }

    }

    draw()
    {
        //c.fillStyle = 'red';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
  
        if(this.image)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    
    }

    update({velocity})// update takes velocity as an argument
    {
        if(this.image)
        {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
        }
    }
    shoot(invaderptojectiles)//shoot fucntion takes an array invaderptojectiles
    {
        invaderptojectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width/2,//position of the projectile is in the midle of the invader
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5,
            }
        }))
    }
}



class Grid //class for the grid of invaders 
{
    constructor()
    {
        this.position = 
        {
            x:0,
            y:0,
        }

        this.velocity={
            x: 3,
            y: 0,
        }

        this.invaders = [];
        const rows = Math.floor(Math.random()*5+2);
        const colums = Math.floor(Math.random()*10+5);

        this.width = colums * 42;
        for (let x = 0; x < colums; x++)
        {
        for (let y = 0; y < rows; y++)
        {
            this.invaders.push(new Invader({
                position: {
                    x: x * 42,//42 is the size of the image in pixels
                    y: y * 42,
                }
            })
            );
        }

        }
      
        //console.log(rows);
    }

    update()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if(this.position.x + this.width >= canva.width || this.position.x <= 0)//this statement is used so the grid doesn't go off screen
        {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 42;
        }
    }
}
class Particle //this class is very general it is used for both explosions and background stars 
{
    constructor({position, velocity, radius, color, fade})//constructor takes in a position and velocity which is updated dynamicly
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color  = color;
        this.opacity = 1;
        this.fade = fade;
    }

    draw()
    {
       c.save();
       c.globalAlpha = this.opacity;
       c.beginPath();
       c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2);
       c.fillStyle = this.color;
       c.fill();
       c.closePath();
       c.restore();
    }
    update()
    {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.fade) this.opacity -= 0.01;// this statement is here so when only explosions fade and not the backround stars
        
    }
}

class Bomb
{
    static radius = 30;
    constructor({position, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = 30;
        this.color ='red';
        this.opacity =1;
        this.active = false;//this is here so that projectiles can go past the bomb radius after it explodes
    }

    draw()
    {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2);
        c.closePath();
        c.fillStyle =this.color;
        c.fill();
        c.restore();
    }
    update()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //code to detect if the bomb is hitting the edges of the canvas 
        if(this.position.x+this.radius+this.velocity.x>= canva.width || this.position.x - this.radius+this.velocity.x <= 0)
        {
            this.velocity.x = -this.velocity.x;
        }
        else if(this.position.y+this.radius+this.velocity.y >= canva.height || this.position.y - this.radius + this.velocity.y <= 0)
        {
            this.velocity.y = -this.velocity.y;
        }
    }

    explode()
    {
       this.active = true;
       this.velocity.x =0;
       this.velocity.y = 0;
        gsap.to(this, {
            radius: 230,
            color: 'white',
        })

        gsap.to(this, {
            duration: 0.1,
            opacity: 0,
            duration: 0.15,
        })
    }
}

function randomBetween(min, max)
{
    return Math .random() * (max -min)+min
}
const player = new Player();
const projectiles = [];
const grids = [];
const invaderprojectiles = [];
const particles = [];
const bombs = [new Bomb({
    position: {
        x: randomBetween(Bomb.radius, canva.width-Bomb.radius),//code is used so bomb spawns in between 0+bomb radius and canvas width - radius of bomb
        y: randomBetween(Bomb.radius, canva.height-Bomb.radius),
    },
    velocity: {
        x: (Math.random() -0.5)*6,
        y: (Math.random() -0.5)*6,
    }
}),
new Bomb({
    position: {
        x: randomBetween(Bomb.radius, canva.width-Bomb.radius),//code is used so bomb spawns in between 0+bomb radius and canvas width - radius of bomb
        y: randomBetween(Bomb.radius, canva.height-Bomb.radius),
    },
    velocity: {
        x: (Math.random() -0.5)*6,
        y: (Math.random() -0.5)*6,
    }
})

];

const keys = {
     a: {
        pressed: false,
     },
     d: {
        pressed: false,
     },
     space: {
        pressed: false,
     },  
}

let frames  = 0;
let ranndomInterval = Math.floor((Math.random()*500) + 500);
let score = 0;

let Game = 
{
    over: false,
    active: true,
}

for(let i =0; i < 100; i++)
{
particles.push(new Particle({
    position: {
        x: Math.random() * canva.width,
        y: Math.random() * canva.height,
    },
    velocity: {
       
        y: 0.3,
        x: 0,
    },
    radius: Math.random() * 3,
    color: 'white',
  })
)
}

function createParticles({object, color, fade})
{
    for(let i =0; i < 15; i++)
    {
    particles.push(new Particle({
        position: {
            x: object.position.x + object.width/2,
            y: object.position.y + object.height/2,
        },
        velocity: {
           
            y: (Math.random() -0.5)*2, 
            x: (Math.random() -0.5) *2,
        },
        radius: Math.random() * 3,
        color: color||'#BAA0DE' ,
        fade: true,
      })
    )
}
}
function createcScoreLabel({score =100, object})
{
    const scorelabel = document.createElement('label');
                            scorelabel.style.position = "absolute";
                            scorelabel.style.color = "white";
                            scorelabel.style.top = object.position.y + 'px';
                            scorelabel.style.left = object.position.x + 'px';
                            scorelabel.innerHTML = score;
                            scorelabel.style.userSelect = "none";
                            document.querySelector('#parentDiv').appendChild(scorelabel);

                            gsap.to(scorelabel, {
                                opacity: 0,
                                y: -30,
                                duration: 0.75,
                                onComplete: () => {
                                    document.querySelector('#parentDiv').removeChild(scorelabel); 
                                }
                            })
                         
}

function animate()//game loop
{
    if(!Game.active) return;
    window.requestAnimationFrame(animate); // requestAnimationFrame
    c.fillStyle = "black";
    c.fillRect(0, 0, canva.width, canva.height);

    for(let i =bombs.length-1; i >= 0; i--)
    {
        const bomb = bombs[i];
        if(bomb.opacity<=0)
        {
            bombs.splice(i, 1);
        }else bomb.update();
    }
    player.update();
    particles.forEach((particle, index) => {

        //detecting if particles are off screen
        if(particle.position.y - particle.radius >= canva.height)
        {
            particle.position.x = Math.random() * canva.width;
            particle.position.y = - particle.radius;
        }
        if(particle.opacity <= 0)
        {
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        }
        else
        {
        particle.update();
        }
    })
    //console.log(particles);

    invaderprojectiles.forEach( (invaderprojectile, index) => {
        //garbage coletion **removing projectiles that are off the screen
        if(invaderprojectile.position.y + invaderprojectile.height >= canva.height)
        {
            setTimeout(() => {
                invaderprojectiles.splice(index, 1);
            }, 0);
        }
        else invaderprojectile.update();
        //projectile hits player
        if(invaderprojectile.position.y+ invaderprojectile.height >= player.position.y &&
            invaderprojectile.position.x + invaderprojectile.width >= player.position.x &&
            invaderprojectile.position.x <= player.position.x + player.width )
        {
            setTimeout(() => {
                invaderprojectiles.splice(index, 1);
                player.opacity = 0;
                Game.over = true;
            }, 0);
            setTimeout(() => {
               Game.active = false ;
            }, 2000);
            createParticles( {
                object: player,
                color:'#064c72',
                fades: true,
             })
        }
    })
    //garbage colection
   for(let  i = projectiles.length-1; i >= 0; i--)
   {
        const projectile = projectiles[i];
        for(let j = bombs.length -1; j >=0; j--)
        {
            const bomb = bombs[j];
            if(Math.hypot(
                projectile.position.x- bomb.position.x,
                projectile.position.y - bomb.position.y) < 
                (bomb.radius + projectile.height) && !bomb.active)
                {
                    projectiles.splice(i,1);
                    bomb.explode();
                }
                console.log(Math.hypot(
                    projectile.position.x- bomb.position.x,
                    projectile.position.y - bomb.position.y));
                console.log(bomb.radius + projectile.height);
        }
        if(projectile.position.y+projectile.height <=0)
        {
            projectiles.splice(i, 1);
        }
        else{
            projectile.update();
        }
        

   }

    grids.forEach( (grid, indexofGrid) => {
        grid.update();

    //spawn projectiles
    if(frames%100 == 0 && grid.invaders.length > 0)
    {
        grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderprojectiles);
    }

    for(let index = grid.invaders.length -1; index >=0; index--)
    {
        const invader = grid.invaders[index];
        //if bomb touches the invaders remove them from the grid
        for(let j = bombs.length -1; j >=0; j--)
        {
            const invaderRadius = 21;
            const bomb = bombs[j];
            if(Math.hypot(
                invader.position.x- bomb.position.x,
                invader.position.y - bomb.position.y) < 
                (invaderRadius+bomb.radius) && bomb.active)
                {
                    grid.invaders.splice(index,1);
                    createcScoreLabel({object:invader});
                    createParticles( {
                        object: invader,
                        fades: true,
                     })
                }
        }
            invader.update({velocity : grid.velocity});
            //COLISION DETECTION
            projectiles.forEach((projectile, i) => {
                if(projectile.position.y- projectile.height <= 
                    invader.position.y+ invader.height && projectile.position.x+ projectile.width >=
                    invader.position.x && projectile.position.x- projectile.width <=
                    invader.position.x+invader.width &&
                    projectile.position.y + projectile.height >= 
                    invader.position.y)
                    //this code is used to check if the projectile is hitin the bottom of the 
                    //invader grid, and also if it is actually in the grid
                {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 =>{
                           return invader2 === invader  
                        });

                        const projectileFound = projectiles.find(projectile2 =>{
                           return projectile2 === projectile
                        });
                        //removes invaders and projectiles
                        if(invaderFound && projectileFound)
                        {
                            score += 100;
                            scoreEl.innerHTML = score;
                            //console.log(score);

                        //dynamic score labels
                        createcScoreLabel({object:invader});

                         createParticles( {
                            object: invader,
                            fades: true,
                         })
                        grid.invaders.splice(index, 1);
                        projectiles.splice(i, 1);
                        }

                        if(grid.invaders.length >= 0)
                        {
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length-1]; 

                            grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                            grid.position.x = firstInvader.position.x;
                        }
                        else{
                            grids.splice(indexofGrid, 1);
                        }
                    }, 0);
                }

            })
    } 
    })
    
    if(keys.a.pressed && player.position.x >=0)
    {
        player.velocity.x = -5;
        player.rotatation = -0.15;
    }
    else if(keys.d.pressed && player.position.x+ player.width <= canva.width)
    {
        player.velocity.x = 5;
        player.rotatation = 0.15;
    }
    else
    {
        player.velocity.x = 0;
        player.rotatation = 0;
    }
    //spawning enemies
    if(frames % ranndomInterval === 0)
    {
        grids.push(new Grid());
        frames = 0;
        ranndomInterval = Math.floor((Math.random()*500) + 500);
    }

   
    frames ++;
}
animate();

window.addEventListener('keydown', ({key}) => 
{
    if(Game.over) return;
    switch(key)
    {
        case('a'):
            keys.a.pressed = true;
            break;
            console.log(key);
        case('d'):
            
            keys.d.pressed = true;
            console.log(key);
            break;
        case(' '):
        
            keys.space.pressed = true;
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width/2,
                    y: player.position.y + player.height/2,
                },
                velocity: {
                    x: 0,
                    y: -10,
                }
            }));
            //console.log(projectiles);
            break;
    }
})

window.addEventListener('keyup', ({key}) => 
{
    switch(key)
    {
        case('a'):
            
            keys.a.pressed = false;
            break;
        case('d'):
        
            keys.d.pressed = false;
            break;
        case(' '):
            keys.space.pressed = false;
            break;
    }
})