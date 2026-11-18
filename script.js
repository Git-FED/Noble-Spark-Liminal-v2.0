(() => {
  'use strict';

  const canvas = document.getElementById('current');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let last = 0;
  let sparks = [];
  let strands = [];

  const palette = {
    cyan: [103, 241, 255],
    violet: [157, 123, 255],
    blue: [62, 127, 255],
    white: [224, 239, 255]
  };

  const random = (min, max) => min + Math.random() * (max - min);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const color = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildField();
  }

  function buildField() {
    const scale = Math.min(width, height);
    const count = Math.round(clamp((width * height) / 19000, 32, 105));
    sparks = Array.from({ length: count }, () => ({
      x: random(0, width),
      y: random(0, height),
      size: random(.45, 1.8) * (scale / 800),
      speed: random(.08, .42),
      phase: random(0, Math.PI * 2),
      hue: Math.random() > .54 ? palette.cyan : palette.violet,
      flare: Math.random() > .84
    }));

    const strandCount = Math.round(clamp(width / 150, 5, 13));
    strands = Array.from({ length: strandCount }, (_, i) => {
      const points = [];
      const startY = height * (0.12 + (i / Math.max(1, strandCount - 1)) * .78) + random(-45, 45);
      const tilt = random(-.22, .22);
      const bend = random(-.18, .18);
      for (let j = 0; j <= 10; j += 1) {
        const t = j / 10;
        points.push({
          x: -width * .15 + t * width * 1.3,
          y: startY + tilt * width * t + Math.sin(t * Math.PI) * bend * height + random(-8, 8)
        });
      }
      return { points, speed: random(.00012, .0003), offset: random(0, 100), color: i % 3 ? palette.cyan : palette.violet };
    });
  }

  function drawStrand(strand, time) {
    const p = strand.points;
    const drift = Math.sin(time * strand.speed + strand.offset) * 18;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y + drift);
    for (let i = 1; i < p.length - 2; i += 1) {
      const xc = (p[i].x + p[i + 1].x) / 2;
      const yc = (p[i].y + p[i + 1].y) / 2 + drift;
      ctx.quadraticCurveTo(p[i].x, p[i].y + drift, xc, yc);
    }
    ctx.quadraticCurveTo(p[p.length - 2].x, p[p.length - 2].y + drift, p[p.length - 1].x, p[p.length - 1].y + drift);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, color(strand.color, 0));
    grad.addColorStop(.3, color(strand.color, .04));
    grad.addColorStop(.52, color(strand.color, .26));
    grad.addColorStop(.72, color(strand.color, .035));
    grad.addColorStop(1, color(strand.color, 0));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.05;
    ctx.shadowBlur = 14;
    ctx.shadowColor = color(strand.color, .48);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawSpark(spark, time) {
    const pulse = .6 + .4 * Math.sin(time * .001 * spark.speed * 18 + spark.phase);
    const x = spark.x + Math.sin(time * .00012 + spark.phase) * 10;
    const y = spark.y + Math.cos(time * .00016 + spark.phase) * 7;
    const radius = spark.size * (spark.flare ? 1.8 + pulse * 1.7 : 1 + pulse * .25);
    const alpha = (spark.flare ? .35 : .16) + pulse * (spark.flare ? .5 : .14);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 9);
    glow.addColorStop(0, color(spark.hue, alpha));
    glow.addColorStop(.2, color(spark.hue, alpha * .2));
    glow.addColorStop(1, color(spark.hue, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color(spark.flare ? palette.white : spark.hue, alpha + .15);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(time) {
    const delta = Math.min(40, time - last || 16);
    last = time;
    frame += delta;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(5, 6, 10, .14)';
    ctx.fillRect(0, 0, width, height);

    const wash = ctx.createRadialGradient(width * .52, height * .48, 0, width * .52, height * .48, Math.max(width, height) * .72);
    wash.addColorStop(0, 'rgba(24, 28, 55, .12)');
    wash.addColorStop(.55, 'rgba(5, 6, 12, .02)');
    wash.addColorStop(1, 'rgba(0, 0, 0, .2)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);

    strands.forEach((strand) => drawStrand(strand, frame));
    sparks.forEach((spark) => drawSpark(spark, frame));

    if (!reduceMotion) requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  render(0);
})();
