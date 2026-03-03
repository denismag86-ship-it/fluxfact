/**
 * Compound Interest Calculator — interactive React island.
 * Shows growth chart with principal vs interest breakdown.
 */
import { useState, useCallback, useMemo } from 'react';

interface YearData {
  year: number;
  balance: number;
  principal: number;
  interest: number;
  yearlyContribution: number;
}

function calculate(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  compoundFrequency: number
): YearData[] {
  const data: YearData[] = [];
  let balance = principal;
  let totalContributions = principal;
  const ratePerPeriod = annualRate / 100 / compoundFrequency;

  for (let y = 1; y <= years; y++) {
    const yearlyAdd = monthlyContribution * 12;
    for (let p = 0; p < compoundFrequency; p++) {
      balance += (monthlyContribution * 12) / compoundFrequency;
      balance *= 1 + ratePerPeriod;
    }
    totalContributions += yearlyAdd;
    data.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      principal: Math.round(totalContributions * 100) / 100,
      interest: Math.round((balance - totalContributions) * 100) / 100,
      yearlyContribution: yearlyAdd,
    });
  }
  return data;
}

function formatCurrency(val: number, currency: string = '$'): string {
  if (val >= 1_000_000) return `${currency}${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${currency}${(val / 1_000).toFixed(1)}K`;
  return `${currency}${val.toFixed(2)}`;
}

function formatFull(val: number, currency: string = '$'): string {
  return `${currency}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Simple bar chart — no external deps */
function GrowthChart({ data }: { data: YearData[] }) {
  const maxVal = data.length ? data[data.length - 1].balance : 1;
  const step = data.length > 20 ? Math.ceil(data.length / 20) : 1;
  const filtered = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1" style={{ height: '200px' }}>
        {filtered.map((d) => {
          const totalH = (d.balance / maxVal) * 100;
          const principalH = (d.principal / maxVal) * 100;
          const interestH = totalH - principalH;

          return (
            <div key={d.year} className="flex-1 flex flex-col justify-end items-center gap-0 relative group" style={{ height: '100%' }}>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 px-3 py-2 rounded-lg text-xs whitespace-nowrap"
                   style={{ background: '#141B3C', border: '1px solid rgba(31,40,71,1)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <div className="text-white font-medium">Year {d.year}</div>
                <div style={{ color: '#34D399' }}>Balance: {formatFull(d.balance)}</div>
                <div style={{ color: '#00E5FF' }}>Principal: {formatFull(d.principal)}</div>
                <div style={{ color: '#00FF88' }}>Interest: {formatFull(d.interest)}</div>
              </div>
              {/* Interest bar */}
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{
                  height: `${interestH}%`,
                  background: 'linear-gradient(180deg, #00FF88, #00E5FF)',
                  opacity: 0.8,
                }}
              />
              {/* Principal bar */}
              <div
                className="w-full transition-all duration-300"
                style={{
                  height: `${principalH}%`,
                  background: 'rgba(255,255,255,0.15)',
                }}
              />
            </div>
          );
        })}
      </div>
      {/* X labels */}
      <div className="flex gap-1">
        {filtered.map((d) => (
          <div key={d.year} className="flex-1 text-center text-[10px] font-mono" style={{ color: '#5B6B8A' }}>
            {d.year}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-6 justify-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="text-xs" style={{ color: '#A0B0D0' }}>Principal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg, #00E5FF, #00FF88)' }} />
          <span className="text-xs" style={{ color: '#A0B0D0' }}>Interest earned</span>
        </div>
      </div>
    </div>
  );
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [frequency, setFrequency] = useState<number>(12);
  const [showResult, setShowResult] = useState(false);

  const frequencies = [
    { value: 1, label: 'Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' },
  ];

  const data = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const m = parseFloat(monthly) || 0;
    const r = parseFloat(rate) || 0;
    const y = parseInt(years) || 0;
    if (y <= 0 || y > 50) return [];
    return calculate(p, m, r, y, frequency);
  }, [principal, monthly, rate, years, frequency]);

  const handleCalculate = useCallback(() => {
    if (data.length > 0) {
      setShowResult(false);
      requestAnimationFrame(() => setShowResult(true));
    }
  }, [data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate();
  }, [handleCalculate]);

  const finalData = data.length > 0 ? data[data.length - 1] : null;

  const inputStyle = {
    background: '#141B3C',
    border: '1px solid #1F2847',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  };

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(0,229,255,0.5)';
    e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(0,229,255,0.1)';
  };

  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#1F2847';
    e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
  };

  return (
    <div className="space-y-8">
      {/* Compound frequency toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit flex-wrap" style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(31,40,71,0.8)' }}>
        {frequencies.map((f) => (
          <button
            key={f.value}
            onClick={() => setFrequency(f.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: frequency === f.value ? 'linear-gradient(135deg, #00E5FF, #00FF88)' : 'transparent',
              color: frequency === f.value ? 'white' : '#A0B0D0',
              boxShadow: frequency === f.value ? '0 0 20px -4px rgba(0,229,255,0.4)' : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#A0B0D0' }}>
            Initial Investment ($)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="10000"
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#5B6B8A] transition-all duration-200 focus:outline-none"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
            min="0"
            step="100"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#A0B0D0' }}>
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="500"
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#5B6B8A] transition-all duration-200 focus:outline-none"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
            min="0"
            step="50"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#A0B0D0' }}>
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="7"
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#5B6B8A] transition-all duration-200 focus:outline-none"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
            min="0"
            max="50"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#A0B0D0' }}>
            Time Period (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="20"
            className="w-full min-h-[52px] px-4 py-3 rounded-xl text-lg text-white placeholder-[#5B6B8A] transition-all duration-200 focus:outline-none"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
            min="1"
            max="50"
            step="1"
          />
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
          boxShadow: '0 0 30px -6px rgba(0,229,255,0.4)',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.boxShadow = '0 0 40px -4px rgba(0,229,255,0.6)';
          (e.target as HTMLElement).style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.boxShadow = '0 0 30px -6px rgba(0,229,255,0.4)';
          (e.target as HTMLElement).style.filter = 'brightness(1)';
        }}
      >
        Calculate Growth
      </button>

      {/* Result */}
      {finalData && showResult && (
        <div
          className="space-y-6 transition-all duration-500"
          style={{
            opacity: showResult ? 1 : 0,
            transform: showResult ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="relative overflow-hidden text-center p-6 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(0,255,136,0.06))', border: '1px solid rgba(0,229,255,0.2)' }}
            >
              <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: '#A0B0D0' }}>
                Final Balance
              </p>
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatCurrency(finalData.balance)}
              </div>
            </div>

            <div
              className="text-center p-6 rounded-2xl"
              style={{ background: 'rgba(31,40,71,0.4)', border: '1px solid rgba(31,40,71,0.8)' }}
            >
              <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: '#A0B0D0' }}>
                Total Invested
              </p>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {formatCurrency(finalData.principal)}
              </div>
            </div>

            <div
              className="text-center p-6 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.15)' }}
            >
              <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: '#A0B0D0' }}>
                Interest Earned
              </p>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: '#34D399' }}>
                {formatCurrency(finalData.interest)}
              </div>
            </div>
          </div>

          {/* Growth multiplier */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.12)' }}
          >
            <svg className="w-5 h-5 shrink-0" style={{ color: '#00E5FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm" style={{ color: '#00E5FF' }}>
              Your money grew <strong className="font-semibold text-white">{(finalData.balance / finalData.principal).toFixed(1)}x</strong> over {years} years.
              Interest earned is <strong className="font-semibold text-white">{((finalData.interest / finalData.balance) * 100).toFixed(0)}%</strong> of your final balance.
            </span>
          </div>

          {/* Chart */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(31,40,71,0.3)', border: '1px solid rgba(31,40,71,0.6)' }}
          >
            <h3 className="text-sm font-medium mb-4" style={{ color: '#A0B0D0' }}>Growth Over Time</h3>
            <GrowthChart data={data} />
          </div>

          {/* Year-by-year table (collapsible) */}
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors hover:text-accent-blue" style={{ color: '#A0B0D0' }}>
              <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Year-by-year breakdown
            </summary>
            <div className="mt-4 overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(31,40,71,0.8)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(31,40,71,0.4)' }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: '#A0B0D0' }}>Year</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: '#A0B0D0' }}>Balance</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: '#A0B0D0' }}>Principal</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: '#A0B0D0' }}>Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d) => (
                    <tr key={d.year} className="transition-colors hover:bg-white/[0.02]" style={{ borderTop: '1px solid rgba(0,229,255,0.04)' }}>
                      <td className="px-4 py-2.5 font-mono text-white">{d.year}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: '#00E5FF' }}>{formatFull(d.balance)}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: '#A0B0D0' }}>{formatFull(d.principal)}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: '#34D399' }}>{formatFull(d.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
