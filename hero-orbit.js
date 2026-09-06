(() => {
  const scene = document.querySelector('.hero-scene');
  if (!scene) return;
  const apps = [...scene.querySelectorAll('.orbit-app')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 640px)');
  let frame = 0, visible = false, previous = 0, elapsed = 0;
  let width = scene.clientWidth, height = scene.clientHeight;
  function paint() {
    apps.forEach((app, i) => {
      const angle = elapsed * (mobile.matches ? .00009 : .00014) + i * Math.PI / 2 + .45;
      const depth = Math.sin(angle);
      const x = Math.cos(angle) * width * .39;
      const y = depth * height * (mobile.matches ? .10 : .14);
      const scale = .82 + (depth + 1) * .13;
      app.style.transform = `translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${scale}) rotate(${Math.cos(angle)*5}deg)`;
      app.style.zIndex = depth >= 0 ? '3' : '1';
    });
  }
  function tick(time) {
    if (previous) elapsed += Math.min(time - previous, 50);
    previous = time; paint(); frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); previous = 0;
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    else paint();
  }
  new ResizeObserver(() => {width = scene.clientWidth; height = scene.clientHeight; paint();}).observe(scene);
  new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();}).observe(scene);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  paint();
})();