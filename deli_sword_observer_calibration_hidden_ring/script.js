
const holdTarget = document.getElementById('holdTarget');
const mainArt = document.getElementById('mainArt');
const statusText = document.getElementById('statusText');
const holdRing = document.getElementById('holdRing');
const oceanPlayer = document.getElementById('oceanPlayer');
const observerCount = document.getElementById('observerCount');
const veil = document.getElementById('veil');

let holdTimer = null;
let progressTimer = null;
let calibrated = false;
let observers = 127;
let startedAt = 0;

if (oceanPlayer) {
  oceanPlayer.volume = 0.16;
}

setInterval(() => {
  const shift = Math.random() > 0.35 ? 1 : -1;
  observers = Math.max(119, Math.min(164, observers + shift));
  observerCount.textContent = `${observers} observers connected`;
}, 4200);

function flashText(text) {
  statusText.classList.remove('status-flash');
  void statusText.offsetWidth;
  statusText.textContent = text;
  statusText.classList.add('status-flash');
}

function createSpark(x, y) {
  const spark = document.createElement('div');
  spark.className = 'cursor-spark';
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 700);
}

document.addEventListener('pointermove', (event) => {
  createSpark(event.clientX, event.clientY);
}, { passive: true });

function beginCalibration(event) {
  event.preventDefault();

  if (calibrated) return;

  startedAt = Date.now();
  holdRing.classList.add('active');
  flashText('calibrating');

  if (oceanPlayer) {
    oceanPlayer.currentTime = 0;
    oceanPlayer.play().catch(() => {});
  }

  clearTimeout(holdTimer);
  clearInterval(progressTimer);

  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt;

    if (elapsed > 650 && elapsed < 1400) {
      statusText.textContent = 'signal stabilizing';
    } else if (elapsed >= 1400) {
      statusText.textContent = 'do not let go';
    }
  }, 220);

  holdTimer = setTimeout(() => {
    calibrated = true;
    clearInterval(progressTimer);

    mainArt.classList.add('calibrated');
    holdRing.classList.remove('active');
    veil.style.background = 'rgba(0,0,0,.04)';
    flashText('a life was never broken');

    document.body.style.filter = 'saturate(1.08) brightness(1.02)';
  }, 2200);
}

function cancelCalibration(event) {
  if (event) event.preventDefault();

  holdRing.classList.remove('active');

  if (calibrated) return;

  clearTimeout(holdTimer);
  clearInterval(progressTimer);

  flashText('connection lost');

  if (oceanPlayer) {
    oceanPlayer.pause();
    oceanPlayer.currentTime = 0;
  }

  setTimeout(() => {
    if (!calibrated) statusText.textContent = 'touch and hold to calibrate';
  }, 900);
}

holdTarget.addEventListener('pointerdown', beginCalibration);
holdTarget.addEventListener('pointerup', cancelCalibration);
holdTarget.addEventListener('pointerleave', cancelCalibration);
holdTarget.addEventListener('pointercancel', cancelCalibration);

holdTarget.addEventListener('touchstart', beginCalibration, { passive: false });
holdTarget.addEventListener('touchend', cancelCalibration, { passive: false });
