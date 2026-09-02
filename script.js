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

const cols = 12;
const rows = 8;
const cells = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    cells.push({
      col: c,
      row: r,
      life: Math.random(),
      baseAngle: (r * cols + c) * (Math.PI / 6),
      seed: Math.random() * 1000
    });
  }
}

function animate() {
  currentSpeed *= 0.85;
  smoothSpeed += (currentSpeed - smoothSpeed) * 0.1;

  const isMoving = smoothSpeed > 4;
  const chaos = isMoving ? 0 : 1;

  ctx.fillStyle = 'rgba(3, 0, 8, 0.25)';
  ctx.fillRect(0, 0, width, height);

  const cellW = width / cols;
  const cellH = height / rows;
  const maxR = Math.min(cellW, cellH) * 0.35;

  const time = Date.now() * 0.005;
  const dynamicHue = (Date.now() * 0.6) % 360;

  for (const cell of cells) {
    // Wave decay propagation pattern
    const waveDecay = Math.sin(time * 4 + cell.col * 0.6 + cell.row * 0.6) * 0.02;
    const decayRate = isMoving ? 0.002 : Math.max(0.01, 0.035 + waveDecay);
    cell.life -= decayRate;
    if (cell.life <= 0) cell.life = 1;

    // Positional floating and chaotic drift
    const moveRadius = chaos * 30;
    const driftX = Math.sin(time * 3 + cell.seed) * moveRadius;
    const driftY = Math.cos(time * 2 + cell.seed) * moveRadius;

    const cx = cell.col * cellW + cellW / 2 + driftX;
    const cy = cell.row * cellH + cellH / 2 + driftY;

    // Spiral rotation
    const chaosRotation = (1 - cell.life) * Math.PI * (1 + chaos * 12);
    const rotation = cell.baseAngle + chaosRotation;
    const r = maxR * (0.2 + cell.life * 0.8);

    // Rapid strobe flashing during stillness
    const flashStrobe = chaos > 0 && Math.sin(time * 25 + cell.seed) > 0.3;
    const lightness = flashStrobe ? 85 : 55;

    const color = chaos > 0 
      ? `hsl(${(dynamicHue + cell.col * 25 + cell.row * 15) % 360}, 100%, ${lightness}%)` 
      : '#00f3ff';

    const alpha = flashStrobe ? 1.0 : Math.max(0.25, cell.life);

    drawTriangle(cx, cy, r, rotation, alpha, color);
  }

  requestAnimationFrame(animate);
}

animate();