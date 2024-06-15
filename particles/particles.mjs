import {Vector} from "./vector.mjs";

const fraction = 0.05;
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

  createParticlesAt(pos) {
    for (let i = 0; i < 5; i++) {
      this.createParticle(new Vector(pos.x, pos.y), Vector.fromAngle(Math.random() * Math.PI * 2), 1 + Math.random() * 3);
    }
  }

  step(scale) {
    const deadParticles = [];
    for (const particle of this.particles.values()) {
      particle.step(scale, this.particles.size > 1000 ? fraction * 2 : fraction);
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

  draw(ctx, scale) {
    for (const particle of this.particles.values()) {
      particle.draw(ctx, scale);
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

  step(scale, fraction) {
    this.velocity *= (1 - fraction);
    this.pos.x += this.direction.x * this.velocity / scale;
    this.pos.y += this.direction.y * this.velocity / scale;
  }

  draw(ctx, scale) {
    ctx.beginPath();
    ctx.fillStyle = 'hsl(' + (180 + 60 - this.velocity * 70) + ' 100% 50% / ' + (Math.min(100, this.velocity * 100)) + '%)';
    ctx.arc(this.pos.x, this.pos.y, 1 / scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

export {Particles}