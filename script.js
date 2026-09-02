const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawTriangle(cx, cy, r, rotation, alpha, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

let lastMouse = { x: 0, y: 0 };
let currentSpeed = 0;
let smoothSpeed = 0;

window.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastMouse.x;
  const dy = e.clientY - lastMouse.y;
  currentSpeed = Math.hypot(dx, dy);
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
});

const count = 90;
const triangles = [];

for (let i = 0; i < count; i++) {
  triangles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.5) * 12,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.4,
    baseR: 12 + Math.random() * 32,
    seed: Math.random() * 1000
  });
}

function animate() {
  currentSpeed *= 0.85;
  smoothSpeed += (currentSpeed - smoothSpeed) * 0.1;

  const isMoving = smoothSpeed > 4;
  const chaos = isMoving ? 0 : 1;

  // Dark motion trail
  ctx.fillStyle = 'rgba(3, 0, 8, 0.2)';
  ctx.fillRect(0, 0, width, height);

  const time = Date.now() * 0.005;
  const dynamicHue = (Date.now() * 0.8) % 360;

  for (let i = 0; i < triangles.length; i++) {
    const t = triangles[i];

    if (chaos > 0) {
      // Erratic trajectory thrusts
      t.vx += (Math.random() - 0.5) * 5;
      t.vy += (Math.random() - 0.5) * 5;

      // Speed cap for chaotic flying
      const speed = Math.hypot(t.vx, t.vy);
      if (speed > 24) {
        t.vx = (t.vx / speed) * 24;
        t.vy = (t.vy / speed) * 24;
      }

      t.x += t.vx;
      t.y += t.vy;
      t.angle += t.spin * 4;

      // Wrap around screen boundaries
      if (t.x < -60) t.x = width + 60;
      if (t.x > width + 60) t.x = -60;
      if (t.y < -60) t.y = height + 60;
      if (t.y > height + 60) t.y = -60;
    } else {
      // Dampen velocity when cursor is moving
      t.vx *= 0.88;
      t.vy *= 0.88;
      t.x += t.vx;
      t.y += t.vy;
      t.angle += 0.02;
    }

    // Dynamic shrink & enlarge scale multiplier
    const scaleNoise = Math.sin(time * 9 + t.seed) * Math.cos(time * 4 + i);
    const sizeMultiplier = chaos > 0 ? Math.max(0.15, 1.2 + scaleNoise * 1.8) : 1;
    const r = t.baseR * sizeMultiplier;

    // Strobe flash
    const flashStrobe = chaos > 0 && Math.sin(time * 30 + t.seed) > 0.1;
    const lightness = flashStrobe ? 90 : 55;

    const color = chaos > 0 
      ? `hsl(${(dynamicHue + i * 15 + t.x * 0.1) % 360}, 100%, ${lightness}%)` 
      : '#00f3ff';

    const alpha = flashStrobe ? 1.0 : 0.7;

    drawTriangle(t.x, t.y, r, t.angle, alpha, color);
  }

  requestAnimationFrame(animate);
}

animate();