'use client';
import { Particles, ParticlesProvider, type ParticlesPluginRegistrar } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

const initEngine: ParticlesPluginRegistrar = async (engine: Engine) => {
  await loadSlim(engine);
};

/**
 * Slow upward-drifting particles — like embers rising, or prayers ascending.
 * Mounted via next/dynamic with ssr:false from HeroSection since tsparticles needs the canvas/window.
 */
export default function ParticleField() {
  return (
    <ParticlesProvider init={initEngine}>
      <Particles
        id="hero-particles"
        className="absolute inset-0"
        options={{
          fullScreen: { enable: false },
          detectRetina: true,
          particles: {
            number: { value: 40 },
            color: { value: '#ffffff' },
            opacity: { value: 0.25 },
            size: { value: { min: 1, max: 3 } },
            move: {
              enable: true,
              speed: 0.6,
              direction: 'top',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            links: { enable: false },
            collisions: { enable: false },
          },
        }}
      />
    </ParticlesProvider>
  );
}
