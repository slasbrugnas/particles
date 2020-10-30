let canvas = document.getElementById('bg-network');
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.globalAlpha = 0.85;

particle_color = '#e6e6c5';

let mouse = { x: undefined, y: undefined };

document.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class particle {
    constructor(radius, color, x = null, y = null, vx = null, vy = null) {
        this.radius = radius;
        this.color = color;
        this.x = (x === null) ? getRandomInt(ctx.canvas.width) : x;
        this.y = (y === null) ?  getRandomInt(ctx.canvas.height) : y;
        this.vx = (vx === null) ? 2 * Math.random() - 1 : vx;
        this.vy = (vy === null) ? 2 * Math.random() - 1 : vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
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

    reset() {
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

function draw_mouse_linked_particles() {
    for (let i = 0; i < particles.length; i++) {
        let p2 = particles[i];
        draw_links(mouse, p2, 250)
    }
}

function draw_links(p, p2, max_dist) {
    let da = Math.abs(p.x - p2.x);
    let db = Math.abs(p.y - p2.y);
    if (da < max_dist && db < max_dist) {
        let dist = Math.sqrt(da * da + db * db);
        if (dist < max_dist) {
            opacity = 0xFF - (dist / (1 / 0xFF)) / max_dist;
            ctx.strokeStyle = particle_color;
            ctx.lineWidth = (max_dist - dist) / max_dist;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function update() {
    particles.forEach(particle => {
        particle.update();
    })
}

function draw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            let p = particles[i];
            let p2 = particles[j];
            draw_links(p, p2, 150)
        }
    }
    draw_mouse_linked_particles();
}

function animate() {
    update();
    draw();
    if (ctx.canvas.width !== window.innerWidth || ctx.canvas.height !== window.innerHeight) {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < (ctx.canvas.height * ctx.canvas.width) / 30000; i++) {
            particles.push(new particle(2, particle_color));
        }
        console.log(`There are ${particles.length} particles.`)
    }
    window.requestAnimationFrame(animate);
}



let particles = [];
for (let i = 0; i < (window.innerWidth * window.innerHeight) / 30000; i++) {
    particles.push(new particle(2, particle_color));
}
console.log(`There are ${particles.length} particles.`)
window.requestAnimationFrame(animate);