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
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.4,
    baseR: 12 + Math.random() * 32,
    seed: Math.random() * 1000
  });
}

let idleFrames = 0;
// Increased to 600 frames (~10 seconds of full stillness for peak chaos)
const RAMP_TIME = 600; 

function animate() {
  currentSpeed *= 0.85;
  smoothSpeed += (currentSpeed - smoothSpeed) * 0.1;

  const isMoving = smoothSpeed > 4;

  if (isMoving) {
    idleFrames = Math.max(0, idleFrames - 15); // Fast snap back to order when moving
  } else {
    idleFrames = Math.min(RAMP_TIME, idleFrames + 1); // Extended, slow-burn chaos build-up
  }

  // Smooth chaos factor from 0.0 (movement) to 1.0 (full 10-second idle decay)
  const chaos = idleFrames / RAMP_TIME;

  ctx.fillStyle = 'rgba(3, 0, 8, 0.2)';
  ctx.fillRect(0, 0, width, height);

  const time = Date.now() * 0.005;
  const dynamicHue = (Date.now() * 0.8) % 360;

  for (let i = 0; i < triangles.length; i++) {
    const t = triangles[i];

    if (chaos > 0) {
      // Acceleration ramps up gradually
      const thrust = chaos * chaos * 4;
      t.vx += (Math.random() - 0.5) * thrust;
      t.vy += (Math.random() - 0.5) * thrust;

      // Speed cap scales slowly over the 10-second ramp
      const maxVel = 1.5 + chaos * 22.5;
      const speed = Math.hypot(t.vx, t.vy);
      if (speed > maxVel) {
        t.vx = (t.vx / speed) * maxVel;
        t.vy = (t.vy / speed) * maxVel;
      }

      t.x += t.vx;
      t.y += t.vy;
      t.angle += t.spin * (0.2 + chaos * 3.8);

      // Boundary wrap
      if (t.x < -60) t.x = width + 60;
      if (t.x > width + 60) t.x = -60;
      if (t.y < -60) t.y = height + 60;
      if (t.y > height + 60) t.y = -60;
    } else {
      t.vx *= 0.85;
      t.vy *= 0.85;
      t.x += t.vx;
      t.y += t.vy;
      t.angle += 0.02;
    }

    // Subtle initial jiggle that slowly amplifies into chaotic displacement
    const glitchX = (Math.random() - 0.5) * chaos * 8;
    const glitchY = (Math.random() - 0.5) * chaos * 8;

    // Size pulsing slowly expands as time builds
    const scaleNoise = Math.sin(time * (4 + chaos * 8) + t.seed);
    const sizeMultiplier = 1 + scaleNoise * (chaos * 1.8);
    const r = Math.max(3, t.baseR * sizeMultiplier);

    // Strobe starts rare, becomes frequent after several seconds
    const flashStrobe = chaos > 0.15 && Math.sin(time * (10 + chaos * 30) + t.seed) > (1 - chaos * 0.9);
    const lightness = flashStrobe ? 90 : 55;

    // Smooth color drift: pure electric cyan -> gradual rainbow shifting
    const targetHue = (dynamicHue + i * 15 + t.x * 0.1) % 360;
    const blendedHue = (185 + (targetHue - 185) * chaos + 360) % 360;

    const color = chaos === 0 
      ? '#00f3ff' 
      : `hsl(${blendedHue}, 100%, ${lightness}%)`;

    const alpha = flashStrobe ? 1.0 : (0.7 + chaos * 0.3);

    drawTriangle(t.x + glitchX, t.y + glitchY, r, t.angle, alpha, color);
  }

  requestAnimationFrame(animate);
}

animate();