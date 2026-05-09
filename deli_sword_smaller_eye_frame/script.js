
const hiddenEye = document.getElementById('hiddenEye');
const oceanPlayer = document.getElementById('oceanPlayer');
const title = document.getElementById('title');
const mainArt = document.querySelector('.main-art');
const observerCount = document.getElementById('observerCount');

let observers = 127;

oceanPlayer.volume = 0.18;

setInterval(() => {
  const shift = Math.random() > 0.35 ? 1 : -1;
  observers = Math.max(119, Math.min(164, observers + shift));
  observerCount.textContent = `${observers} observers connected`;
}, 4200);

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

hiddenEye.addEventListener('click', async () => {

  oceanPlayer.currentTime = 0;

  try{
    await oceanPlayer.play();
  } catch(e){}

  title.classList.add('glitch-active');
  mainArt.classList.add('glitching');
  document.body.classList.add('glitch-scene');

  setTimeout(() => {
    title.classList.remove('glitch-active');
  }, 900);

});
