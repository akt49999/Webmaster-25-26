import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export default function CursorRippleField({ containerRef }) {
  const [renderBubbles, setRenderBubbles] = useState([]);
  const simRef = useRef({ bubbles: [], width: 0, height: 0, reduceMotion: false });
  const bubbleElementsRef = useRef([]);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const isActiveRef = useRef(true);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) {
      return undefined;
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateBubbleStyles = () => {
      const bubbles = simRef.current.bubbles;
      const elements = bubbleElementsRef.current;

      for (let index = 0; index < bubbles.length; index += 1) {
        const bubble = bubbles[index];
        const element = elements[index];

        if (!element) {
          continue;
        }

        element.style.transform = `translate3d(${bubble.x - bubble.radius}px, ${bubble.y - bubble.radius}px, 0)`;
      }
    };

    const initializeBubbles = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const bubbleCount = Math.max(16, Math.min(24, Math.floor(width / 95)));

      const bubbles = Array.from({ length: bubbleCount }, (_, index) => {
        const radius = 26 + Math.random() * 26;
        const mass = radius * radius;
        return {
          id: index,
          x: radius + Math.random() * Math.max(1, width - radius * 2),
          y: radius + Math.random() * Math.max(1, height - radius * 2),
          vx: (Math.random() - 0.5) * 0.48,
          vy: (Math.random() - 0.5) * 0.48,
          radius,
          mass,
          repulseCooldown: 0,
        };
      });

      simRef.current = { bubbles, width, height, reduceMotion };
      setRenderBubbles(
        bubbles.map((bubble) => ({
          id: bubble.id,
          size: bubble.radius * 2,
        }))
      );

      window.requestAnimationFrame(updateBubbleStyles);
    };

    const resolveCollisions = (bubbles) => {
      for (let i = 0; i < bubbles.length; i += 1) {
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const bubbleA = bubbles[i];
          const bubbleB = bubbles[j];
          const dx = bubbleB.x - bubbleA.x;
          const dy = bubbleB.y - bubbleA.y;
          const distance = Math.hypot(dx, dy) || 0.0001;
          const minDistance = bubbleA.radius + bubbleB.radius;

          if (distance >= minDistance) {
            continue;
          }

          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;

          bubbleA.x -= nx * (overlap * 0.5);
          bubbleA.y -= ny * (overlap * 0.5);
          bubbleB.x += nx * (overlap * 0.5);
          bubbleB.y += ny * (overlap * 0.5);

          const relativeVx = bubbleB.vx - bubbleA.vx;
          const relativeVy = bubbleB.vy - bubbleA.vy;
          const velocityAlongNormal = relativeVx * nx + relativeVy * ny;

          if (velocityAlongNormal > 0) {
            continue;
          }

          const restitution = 0.92;
          const impulse =
            (-(1 + restitution) * velocityAlongNormal) /
            (1 / bubbleA.mass + 1 / bubbleB.mass);

          bubbleA.vx -= (impulse * nx) / bubbleA.mass;
          bubbleA.vy -= (impulse * ny) / bubbleA.mass;
          bubbleB.vx += (impulse * nx) / bubbleB.mass;
          bubbleB.vy += (impulse * ny) / bubbleB.mass;
        }
      }
    };

    const tick = (time) => {
      if (!isActiveRef.current) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const sim = simRef.current;
      const bubbles = sim.bubbles;

      if (!bubbles.length) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const elapsed = time - lastTimeRef.current;
      const dt = Math.min(1.6, elapsed / 16.67);
      lastTimeRef.current = time;

      const viscosity = sim.reduceMotion ? 0.992 : 0.9974;
      const ambient = sim.reduceMotion ? 0.0012 : 0.003;

      for (let index = 0; index < bubbles.length; index += 1) {
        const bubble = bubbles[index];
        const phase = time * 0.001 + bubble.id * 0.71;

        bubble.vx += Math.sin(phase * 0.88) * ambient;
        bubble.vy += Math.cos(phase * 1.03) * ambient;

        if (bubble.repulseCooldown > 0) {
          bubble.repulseCooldown -= 1;
        }

        bubble.vx *= viscosity;
        bubble.vy *= viscosity;

        bubble.x += bubble.vx * dt * 1.12;
        bubble.y += bubble.vy * dt * 1.12;

        if (bubble.x <= bubble.radius) {
          bubble.x = bubble.radius;
          bubble.vx = Math.abs(bubble.vx) * 0.92;
        } else if (bubble.x >= sim.width - bubble.radius) {
          bubble.x = sim.width - bubble.radius;
          bubble.vx = -Math.abs(bubble.vx) * 0.92;
        }

        if (bubble.y <= bubble.radius) {
          bubble.y = bubble.radius;
          bubble.vy = Math.abs(bubble.vy) * 0.92;
        } else if (bubble.y >= sim.height - bubble.radius) {
          bubble.y = sim.height - bubble.radius;
          bubble.vy = -Math.abs(bubble.vy) * 0.92;
        }
      }

      resolveCollisions(bubbles);

      updateBubbleStyles();

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const repelFromPoint = (event) => {
      const rect = container.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      simRef.current.bubbles.forEach((bubble) => {
        if (bubble.repulseCooldown > 0) {
          return;
        }

        const dx = bubble.x - clickX;
        const dy = bubble.y - clickY;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const influenceRadius = 250;

        if (distance > influenceRadius) {
          return;
        }

        const influence = (influenceRadius - distance) / influenceRadius;
        const push = 0.85 + influence * 3.4;

        bubble.vx += (dx / distance) * push;
        bubble.vy += (dy / distance) * push;
        bubble.repulseCooldown = 4;
      });
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const newCount = Math.max(16, Math.min(24, Math.floor(rect.width / 95)));

      if (newCount !== simRef.current.bubbles.length) {
        initializeBubbles();
        return;
      }

      simRef.current.width = rect.width;
      simRef.current.height = rect.height;

      simRef.current.bubbles.forEach((bubble) => {
        bubble.x = Math.min(Math.max(bubble.radius, bubble.x), rect.width - bubble.radius);
        bubble.y = Math.min(Math.max(bubble.radius, bubble.y), rect.height - bubble.radius);
      });

      updateBubbleStyles();
    };

    const visibilityHandler = () => {
      isActiveRef.current = document.visibilityState === 'visible';
      if (isActiveRef.current) {
        lastTimeRef.current = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = entry.isIntersecting && document.visibilityState === 'visible';
        if (isActiveRef.current) {
          lastTimeRef.current = 0;
        }
      },
      { threshold: 0.1 }
    );

    initializeBubbles();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    intersectionObserver.observe(container);

    document.addEventListener('visibilitychange', visibilityHandler);

    container.addEventListener('pointerdown', repelFromPoint, { passive: true });

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('pointerdown', repelFromPoint);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', visibilityHandler);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      bubbleElementsRef.current = [];
    };
  }, [containerRef]);

  return (
    <div className="cursor-ripple-layer" aria-hidden="true">
      {renderBubbles.map((bubble, index) => (
        <span
          key={bubble.id}
          className="lava-bubble"
          ref={(element) => {
            bubbleElementsRef.current[index] = element;
          }}
          style={{
            '--size': `${bubble.size}px`,
          }}
        />
      ))}
    </div>
  );
}

CursorRippleField.propTypes = {
  containerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};
