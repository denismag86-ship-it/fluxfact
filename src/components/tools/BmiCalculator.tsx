/**
 * BMI Calculator — interactive React island.
 * Runs entirely client-side. Produces shareable result.
 *
 * Design: Vercel/Linear dark aesthetic with animated result reveal.
 */
import { useState, useCallback, useEffect, useRef } from 'react';

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  healthyRange: string;
}

function calculateBmi(weight: number, height: number, unit: 'metric' | 'imperial'): BmiResult | null {
  if (weight <= 0 || height <= 0) return null;

  let bmi: number;
  if (unit === 'metric') {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    bmi = (weight / (height * height)) * 703;
  }

  bmi = Math.round(bmi * 10) / 10;

  const categories = [
    { max: 16, category: 'Severe Underweight', color: '#60A5FA', gradientFrom: '#3B82F6', gradientTo: '#60A5FA', description: 'Your BMI indicates severe underweight. Please consult a healthcare professional.' },
    { max: 18.5, category: 'Underweight', color: '#60A5FA', gradientFrom: '#3B82F6', gradientTo: '#93C5FD', description: 'Your BMI is below the healthy range. Consider consulting a nutritionist.' },
    { max: 25, category: 'Normal Weight', color: '#34D399', gradientFrom: '#10B981', gradientTo: '#34D399', description: 'Your BMI is within the healthy range. Keep up the good work!' },
    { max: 30, category: 'Overweight', color: '#FBBF24', gradientFrom: '#F59E0B', gradientTo: '#FBBF24', description: 'Your BMI is above the healthy range. Small lifestyle changes can help.' },
    { max: 35, category: 'Obese (Class I)', color: '#F97316', gradientFrom: '#EA580C', gradientTo: '#F97316', description: 'Your BMI indicates obesity. Consider speaking with a healthcare provider.' },
    { max: 40, category: 'Obese (Class II)', color: '#EF4444', gradientFrom: '#DC2626', gradientTo: '#EF4444', description: 'Your BMI indicates significant obesity. Professional guidance is recommended.' },
    { max: 100, category: 'Obese (Class III)', color: '#DC2626', gradientFrom: '#B91C1C', gradientTo: '#DC2626', description: 'Your BMI indicates severe obesity. Please seek medical advice.' },
  ];

  const match = categories.find((c) => bmi < c.max) ?? categories[categories.length - 1];

  return {
    bmi,
    category: match.category,
    color: match.color,
    gradientFrom: match.gradientFrom,
    gradientTo: match.gradientTo,
    description: match.description,
    healthyRange: unit === 'metric'
      ? `${Math.round(18.5 * (height / 100) ** 2)}–${Math.round(24.9 * (height / 100) ** 2)} kg`
      : `${Math.round((18.5 * height * height) / 703)}–${Math.round((24.9 * height * height) / 703)} lbs`,
  };
}

/** Animated number counter */
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>();

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round((start + diff * eased) * 10) / 10);
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };

    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value]);

  return (
    <span
      style={{
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {display.toFixed(1)}
    </span>
  );
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BmiResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = useCallback(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;
    setShowResult(false);
    const res = calculateBmi(w, h, unit);
    setResult(res);
    // Trigger animation
    requestAnimationFrame(() => setShowResult(true));
  }, [weight, height, unit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate();
  }, [handleCalculate]);

  const scalePosition = result ? Math.min(100, Math.max(0, ((result.bmi - 15) / 25) * 100)) : 0;

  return (
    <div className="space-y-8">
      {/* Unit toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {(['metric', 'imperial'] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className="relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: unit === u ? 'linear-gradient(135deg, #007CF0, #00DFD8)' : 'transparent',
              color: unit === u ? 'white' : '#95a2b3',
              boxShadow: unit === u ? '0 0 20px -4px rgba(0,124,240,0.4)' : 'none',
            }}
          >
            {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lbs/in)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#95a2b3' }}>
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={unit === 'metric' ? '70' : '154'}
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#52525b] transition-all duration-200 focus:outline-none"
            style={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0,124,240,0.5)';
              e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(0,124,240,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
            }}
            min="1"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#95a2b3' }}>
            Height ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={unit === 'metric' ? '175' : '69'}
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#52525b] transition-all duration-200 focus:outline-none"
            style={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0,124,240,0.5)';
              e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(0,124,240,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
            }}
            min="1"
            step="0.1"
          />
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #007CF0, #00DFD8)',
          boxShadow: '0 0 30px -6px rgba(0,124,240,0.4)',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.boxShadow = '0 0 40px -4px rgba(0,124,240,0.6)';
          (e.target as HTMLElement).style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.boxShadow = '0 0 30px -6px rgba(0,124,240,0.4)';
          (e.target as HTMLElement).style.filter = 'brightness(1)';
        }}
      >
        Calculate BMI
      </button>

      {/* Result */}
      {result && (
        <div
          className="space-y-6 transition-all duration-500"
          style={{
            opacity: showResult ? 1 : 0,
            transform: showResult ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Main result card */}
          <div
            className="relative overflow-hidden text-center p-10 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${result.gradientFrom}15, ${result.gradientTo}08)`,
              border: `1px solid ${result.color}30`,
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: result.color, opacity: 0.06, filter: 'blur(60px)' }}
            />

            <div className="relative z-10">
              <p className="text-[13px] font-medium tracking-widest uppercase mb-3" style={{ color: '#95a2b3' }}>
                Your BMI
              </p>
              <div className="font-bold leading-none mb-3" style={{ fontSize: 'clamp(56px, 12vw, 80px)', letterSpacing: '-0.04em' }}>
                <AnimatedNumber value={result.bmi} color={result.color} />
              </div>
              <div className="text-lg font-semibold text-white mb-2">{result.category}</div>
              <p className="text-sm max-w-md mx-auto" style={{ color: '#95a2b3' }}>{result.description}</p>
            </div>
          </div>

          {/* BMI Scale — refined */}
          <div className="relative px-2">
            <div className="flex rounded-full overflow-hidden h-2.5 gap-0.5">
              {[
                { color: '#3B82F6', label: 'Underweight' },
                { color: '#10B981', label: 'Normal' },
                { color: '#F59E0B', label: 'Overweight' },
                { color: '#F97316', label: 'Obese I' },
                { color: '#EF4444', label: 'Obese II+' },
              ].map((seg) => (
                <div
                  key={seg.label}
                  className="flex-1 rounded-full"
                  style={{ background: seg.color, opacity: 0.6 }}
                  title={seg.label}
                />
              ))}
            </div>
            {/* Animated marker */}
            <div
              className="absolute top-0 -mt-1.5 w-6 h-6 rounded-full border-2 border-white transition-all duration-700 ease-out"
              style={{
                left: `calc(${scalePosition}% - 12px)`,
                background: '#09090b',
                boxShadow: `0 0 12px ${result.color}80`,
              }}
            >
              <div className="w-full h-full rounded-full" style={{ background: result.color, opacity: 0.8 }} />
            </div>
            <div className="flex justify-between mt-4 text-xs font-mono" style={{ color: '#52525b' }}>
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40+</span>
            </div>
          </div>

          {/* Healthy weight range */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
            }}
          >
            <svg className="w-5 h-5 shrink-0" style={{ color: '#34D399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm" style={{ color: '#6EE7B7' }}>
              Healthy weight for your height: <strong className="font-semibold">{result.healthyRange}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
