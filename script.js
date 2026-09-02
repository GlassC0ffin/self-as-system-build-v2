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
  ctx.lineWidth = 1.5;
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
      baseAngle: (r * cols + c) * (Math.PI / 6)
    });
  }
}

function animate() {
  currentSpeed *= 0.85;
  smoothSpeed += (currentSpeed - smoothSpeed) * 0.1;

  // Strict 4px/frame speed threshold
  const isMoving = smoothSpeed > 4;
  const chaos = isMoving ? 0 : 1;

  ctx.fillStyle = 'rgba(26, 19, 48, 0.15)';
  ctx.fillRect(0, 0, width, height);

  const cellW = width / cols;
  const cellH = height / rows;
  const maxR = Math.min(cellW, cellH) * 0.35;

  for (const cell of cells) {
    const decayRate = isMoving ? 0.002 : 0.035;
    cell.life -= decayRate;
    if (cell.life <= 0) cell.life = 1;

    const cx = cell.col * cellW + cellW / 2;
    const cy = cell.row * cellH + cellH / 2;

    const chaosRotation = (1 - cell.life) * Math.PI * (1 + chaos * 8);
    const rotation = cell.baseAngle + chaosRotation;
    const r = maxR * (0.3 + cell.life * 0.7);

    const color = chaos > 0 ? '#e17b4a' : '#f2e3dc';
    const alpha = Math.max(0.15, cell.life);

    drawTriangle(cx, cy, r, rotation, alpha, color);
  }

  requestAnimationFrame(animate);
}

animate();