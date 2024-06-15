import {Game} from "./game.mjs";
import {Vector} from "./particles/vector.mjs";
import {Particles} from "./particles/particles.mjs";

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


const particles = new Particles();
// particles.createParticle(new Vector(400, 400), new Vector(0, 0), 1);

const game = new Game(particles);
game.fillRandom();

let stepTime = 100;
let lastStep = Date.now();

const update = () => {
  const xScale = worldWidth / (4 + Math.max(Math.abs(game.xMax), Math.abs(game.xMin)) * 2);
  const yScale = worldHeight / (4 + Math.max(Math.abs(game.yMax), Math.abs(game.yMin)) * 2);
  const scale = Math.min(xScale, yScale);

  const now = Date.now();
  if (now > lastStep + stepTime) {
    game.step();
    lastStep = now;
  }
  particles.step(scale);

  ctx.clearRect(0, 0, worldWidth, worldHeight);

  ctx.save();

  ctx.translate(worldWidth2 - 1.5, worldHeight2 - 1.5);
  ctx.scale(scale, scale);
  game.draw(ctx);
  particles.draw(ctx, scale);

  ctx.restore();

  // ctx.save();
  // ctx.translate(worldWidth2 - 1.5, worldHeight2 - 1.5);
  // particles.draw(ctx);
  // ctx.restore();

  updateWorldSettings();
  requestAnimationFrame(update);
}

update();

document.body.addEventListener('click', (evt) => {
  game.step();
  particles.createParticle(new Vector(evt.x, evt.y), Vector.fromAngle(Math.random() * Math.PI * 2), 1 + Math.random() * 3);
});
let speedInput = document.getElementById('inputSpeed');
speedInput.addEventListener("input", () => {
  let val = speedInput.value;
  document.getElementById('speedValue').innerText = val;
  val = parseInt(val);
  if (val <= 0)
    stepTime = Number.MAX_SAFE_INTEGER;
  else
    stepTime = 1000 / val;
})

