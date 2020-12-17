let canvas = document.getElementById('bg-network');
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.globalAlpha = 1.0;

let particles = [];
default_color = '#fafafa';

// Settings
const MAX_LINK_DIST = 180;
const PARTICLE_RADIUS = 5;
const PARTICLE_COLOR_RANGE = [50, 255];
const PARTICLE_AMOUNT = window.innerHeight * window.innerWidth / 28000 < 200
    ? window.innerHeight * window.innerWidth / 28000
    : 200;

let mouse = { x: undefined, y: undefined };

document.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("resize", function (event) {
    location.reload();
});

function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function rgbToHex(r, g, b)
{
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

class particle
{
    constructor(radius, color, x = null, y = null, vx = null, vy = null)
    {
        this.radius = radius;
        this.color = color;
        this.x  =  (x) ?  x : getRandomInt(ctx.canvas.width);
        this.y  =  (y) ?  y : getRandomInt(ctx.canvas.height);
        this.vx = (vx) ? vx : 2 * Math.random() - 1;
        this.vy = (vy) ? vy : 2 * Math.random() - 1;
    }

    draw()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update()
    {
        if (this.x > ctx.canvas.width + 10 ||
            this.y > ctx.canvas.height + 10 ||
            this.x < -10 ||
            this.y < -10)
        {
            this.reset();
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    reset()
    {
        if (getRandomInt(2)) {
            this.x = getRandomInt(2) ? 0 : ctx.canvas.width;
            this.y = getRandomInt(ctx.canvas.height);
        } else {
            this.x = getRandomInt(ctx.canvas.width);
            this.y = getRandomInt(2) ? 0 : ctx.canvas.height;
        }
        this.vx = (this.x > 0) ? Math.random() - 1 : Math.random();
        this.vy = (this.y > 0) ? Math.random() - 1 : Math.random();
    }
}

function draw_mouse_linked_particles(max_dist)
{
    for (let i = 0; i < particles.length; i++) {
        let p2 = particles[i];
        draw_links(mouse, p2, max_dist)
    }
}

function draw_links(p, p2, max_dist)
{
    let da = Math.abs(p.x - p2.x);
    let db = Math.abs(p.y - p2.y);
    if (da < max_dist && db < max_dist) {
        let dist = Math.sqrt(da * da + db * db);
        if (dist < max_dist) {
            opacity = 0xFF - (dist / (1 / 0xFF)) / max_dist;
            ctx.strokeStyle = default_color;
            ctx.lineWidth = (max_dist - dist) / max_dist;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }
}

function update()
{
    particles.forEach(particle => {
        particle.update();
    })
}

function draw()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            let p = particles[i];
            let p2 = particles[j];
            draw_links(p, p2, MAX_LINK_DIST)
        }
    }
    draw_mouse_linked_particles(MAX_LINK_DIST);
}

function animate()
{
    update();
    draw();
    window.requestAnimationFrame(animate);
}

function init()
{
    particles = [];
    for (let i = 0; i < PARTICLE_AMOUNT; i++) {
        const lower_range = PARTICLE_COLOR_RANGE[0];
        const upper_range = PARTICLE_COLOR_RANGE[1] - PARTICLE_COLOR_RANGE[0];
        const randomColor = rgbToHex(
            Math.floor(lower_range + Math.random() * upper_range),
            Math.floor(lower_range + Math.random() * upper_range),
            Math.floor(lower_range + Math.random() * upper_range)
        );
        particles.push(new particle(PARTICLE_RADIUS, randomColor));
    }
    window.requestAnimationFrame(animate);
    console.log(`There are ${particles.length} particles.`)
}

init();