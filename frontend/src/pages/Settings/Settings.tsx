import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Slider } from '../../components/Form/Slider';
import { Toggle } from '../../components/Form/Toggle';
import { Button } from '../../components/Form/Button';

export const Settings: React.FC = () => {
  const [starBrightness, setStarBrightness] = useState<number>(65);
  const [glowIntensity, setGlowIntensity] = useState<number>(42);
  const [connectionLines, setConnectionLines] = useState<boolean>(true);
  const [nebulaEffects, setNebulaEffects] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(42);

  const handleReset = () => {
    setStarBrightness(65);
    setGlowIntensity(42);
    setConnectionLines(true);
    setNebulaEffects(true);
    setAnimationSpeed(42);
  };

  const handleApply = () => {
    console.log('Applied Configurations');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
            Constellation <span className="text-primary/50">Settings</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Personalize your celestial viewport. Define how your objectives manifest in the infinite expanse.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface-container-highest/30 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white mb-6 shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>
            <h4 className="font-label text-xs font-bold uppercase tracking-widest mb-1">White Dwarf</h4>
            <p className="text-[10px] text-on-surface-variant text-center">Stable, compact objectives</p>
          </div>
          
          <div className="bg-surface-container-highest/30 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-secondary mb-4 shadow-[0_0_30px_rgba(189,194,255,0.4)]"></div>
            <h4 className="font-label text-xs font-bold uppercase tracking-widest mb-1">Blue Giant</h4>
            <p className="text-[10px] text-on-surface-variant text-center">High-priority task clusters</p>
          </div>
          
          <div className="bg-surface-container-highest/30 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-tertiary/20 blur-xl animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-tertiary to-white shadow-[0_0_40px_rgba(216,187,244,0.6)]"></div>
            </div>
            <h4 className="font-label text-xs font-bold uppercase tracking-widest mb-1">Supernova</h4>
            <p className="text-[10px] text-on-surface-variant text-center">Urgent system events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <section className="bg-surface-container-highest/20 rounded-3xl p-8 border border-outline-variant/5">
            <h3 className="text-xl font-headline font-semibold mb-8 text-on-surface">Atmospheric Controls</h3>
            <div className="space-y-8">
              <Slider 
                value={starBrightness} 
                onChange={setStarBrightness} 
                label="Star Brightness" 
                displayValue={`${starBrightness}%`}
              />
              <Slider 
                value={glowIntensity} 
                onChange={setGlowIntensity} 
                label="Glow Intensity" 
                displayValue={`${glowIntensity}%`}
              />
            </div>
          </section>

          <section className="bg-surface-container-highest/20 rounded-3xl p-8 border border-outline-variant/5">
            <h3 className="text-xl font-headline font-semibold mb-8 text-on-surface">Default Star Profile</h3>
            <div className="space-y-8">
              <Toggle 
                checked={connectionLines} 
                onChange={setConnectionLines} 
                label="Connection Lines" 
              />
              <Toggle 
                checked={nebulaEffects} 
                onChange={setNebulaEffects} 
                label="Nebula Effects" 
              />
              <div className="pt-4 border-t border-outline-variant/10">
                <Slider 
                  value={animationSpeed} 
                  onChange={setAnimationSpeed} 
                  label="Animation Speed" 
                  displayValue={`${animationSpeed}%`}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-8 border-t border-outline-variant/10">
          <Button variant="ghost" onClick={handleReset}>
            Reset to Galactic Defaults
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Configurations
          </Button>
        </div>
      </div>
    </Layout>
  );
};
