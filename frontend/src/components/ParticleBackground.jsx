import { useEffect, useRef } from "react";

// Lightweight canvas network: a field of drifting nodes connected by lines
// when within range of each other, evoking "network security" without
// pulling in a 3D/WebGL dependency.
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, nodes, animationId;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }

    function initNodes() {
      const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * window.devicePixelRatio,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      const linkDist = 130 * window.devicePixelRatio;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.14 * (1 - dist / linkDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(148, 197, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(tick);
      }
    }

    resize();
    initNodes();
    tick();

    const handleResize = () => {
      resize();
      initNodes();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
