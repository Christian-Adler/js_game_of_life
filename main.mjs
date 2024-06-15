import {Game} from "./game.mjs";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let worldWidth = canvas.width;
let worldHeight = canvas.height;
let worldWidth2 = worldWidth / 2;
let worldHeight2 = worldHeight / 2;

const updateWorldSettings = () => {
  if (worldHeight !== window.innerHeight || worldWidth !== window.innerWidth) {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    worldWidth2 = worldWidth / 2;
    worldHeight2 = worldHeight / 2;
    canvas.width = worldWidth;
    canvas.height = worldHeight;
  }
};

updateWorldSettings();

const game = new Game();
game.fillRandom();

let stepTime = 100;
let lastStep = Date.now();

const update = () => {
  const now = Date.now();
  if (now > lastStep + stepTime) {
    game.step();
    lastStep = now;
  }

  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  const xScale = worldWidth / (4 + Math.max(Math.abs(game.xMax), Math.abs(game.xMin)) * 2);
  const yScale = worldHeight / (4 + Math.max(Math.abs(game.yMax), Math.abs(game.yMin)) * 2);
  const scale = Math.min(xScale, yScale);
  ctx.translate(worldWidth2 - 1.5, worldHeight2 - 1.5);
  ctx.scale(scale, scale);
  game.draw(ctx);

  ctx.restore();
  updateWorldSettings();


  requestAnimationFrame(update);
}

update();

document.body.addEventListener('click', () => {
  game.step();
});
let speedInput = document.getElementById('inputSpeed');
speedInput.addEventListener("change", () => {
  let val = speedInput.value;
  document.getElementById('speedValue').innerText = val;
  val = parseInt(val);
  if (val <= 0)
    stepTime = Number.MAX_SAFE_INTEGER;
  else
    stepTime = 1000 / val;
})