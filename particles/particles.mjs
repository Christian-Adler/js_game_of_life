import {Vector} from "./vector.mjs";

const fraction = 0.99;
let idProvider = 0;

class Particles {
  constructor() {
    this.particles = new Map();
  }

  addParticle(particle) {
    this.particles.set(particle.id, particle);
  }

  createParticle(pos, direction, velocity) {
    const particle = new Particle(pos, direction, velocity);
    this.addParticle(particle);
  }

  step() {
    const deadParticles = [];
    for (const particle of this.particles.values()) {
      particle.step();
      if (particle.velocity < 0.01)
        deadParticles.push(particle);
      else if (particle.velocity > 1 && Math.random() > 0.95) {
        const clone = particle.clone();
        let rad = clone.direction.toRadians();
        rad += (Math.random() - 0.5) * (Math.PI / 10);
        clone.direction = Vector.fromAngle(rad);
        clone.velocity -= clone.velocity * 0.1 * Math.random();
        this.addParticle(clone);
      }
    }
    for (const deadParticle of deadParticles) {
      this.particles.delete(deadParticle.id);
    }
  }

  draw(ctx) {
    for (const particle of this.particles.values()) {
      particle.draw(ctx);
    }
  }
}

class Particle {
  constructor(pos, direction, velocity) {
    this.id = ++idProvider;
    this.pos = pos;
    this.direction = direction;
    this.velocity = velocity;
  }

  clone() {
    return new Particle(this.pos.clone(), this.direction.clone(), this.velocity);
  }

  step() {
    this.velocity *= fraction;
    this.pos.x += this.direction.x * this.velocity;
    this.pos.y += this.direction.y * this.velocity;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'hsl(' + (180 + 60 - this.velocity * 70) + ' 100% 50% / ' + (Math.min(100, this.velocity * 100)) + '%)';
    ctx.arc(this.pos.x, this.pos.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

export {Particles}