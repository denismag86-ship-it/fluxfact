/**
 * Password Strength Checker — interactive React island.
 * Real-time password analysis with entropy calculation and improvement tips.
 * All processing is client-side — no data is sent anywhere.
 */
import { useState, useMemo } from 'react';

interface StrengthResult {
  score: number; // 0-100
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  entropy: number;
  crackTime: string;
  tips: string[];
  checks: { label: string; passed: boolean }[];
}

function analyzePassword(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0, label: 'Enter a password', color: '#5B6B8A',
      gradientFrom: '#5B6B8A', gradientTo: '#5B6B8A',
      entropy: 0, crackTime: '—', tips: [], checks: [],
    };
  }

  const checks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'At least 12 characters', passed: password.length >= 12 },
    { label: 'Contains uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'Contains number', passed: /[0-9]/.test(password) },
    { label: 'Contains special character', passed: /[^A-Za-z0-9]/.test(password) },
    { label: 'No common patterns', passed: !hasCommonPatterns(password) },
    { label: 'No repeated characters (3+)', passed: !/(.)\1{2,}/.test(password) },
  ];

  // Calculate charset size
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;

  const entropy = Math.round(password.length * Math.log2(Math.max(charsetSize, 2)));

  // Score based on entropy + checks
  const passedChecks = checks.filter((c) => c.passed).length;
  let score = Math.min(100, Math.round((entropy / 80) * 60 + (passedChecks / checks.length) * 40));

  // Penalize short passwords
  if (password.length < 6) score = Math.min(score, 15);
  else if (password.length < 8) score = Math.min(score, 30);

  // Penalize common patterns heavily
  if (hasCommonPatterns(password)) score = Math.min(score, 25);

  const crackTime = estimateCrackTime(entropy);

  const tips: string[] = [];
  if (password.length < 12) tips.push('Make it at least 12 characters long');
  if (!/[A-Z]/.test(password)) tips.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) tips.push('Add some numbers');
  if (!/[^A-Za-z0-9]/.test(password)) tips.push('Add special characters (!@#$%^&*)');
  if (/(.)\1{2,}/.test(password)) tips.push('Avoid repeating the same character');
  if (hasCommonPatterns(password)) tips.push('Avoid common words and patterns');
  if (password.length >= 12 && passedChecks >= 6) tips.push('Consider using a passphrase: 4+ random words');

  let label: string, color: string, gFrom: string, gTo: string;
  if (score < 20) { label = 'Very Weak'; color = '#EF4444'; gFrom = '#DC2626'; gTo = '#EF4444'; }
  else if (score < 40) { label = 'Weak'; color = '#F97316'; gFrom = '#EA580C'; gTo = '#F97316'; }
  else if (score < 60) { label = 'Fair'; color = '#FBBF24'; gFrom = '#F59E0B'; gTo = '#FBBF24'; }
  else if (score < 80) { label = 'Strong'; color = '#34D399'; gFrom = '#10B981'; gTo = '#34D399'; }
  else { label = 'Very Strong'; color = '#22D3EE'; gFrom = '#06B6D4'; gTo = '#22D3EE'; }

  return { score, label, color, gradientFrom: gFrom, gradientTo: gTo, entropy, crackTime, tips, checks };
}

function hasCommonPatterns(pw: string): boolean {
  const lower = pw.toLowerCase();
  const common = [
    'password', '123456', 'qwerty', 'abc123', 'letmein', 'welcome',
    'monkey', 'dragon', 'master', 'admin', 'login', 'princess',
    'iloveyou', 'sunshine', 'trustno1', 'shadow', 'ashley', 'football',
    'baseball', 'access', 'hello', '1234', 'pass', 'test',
  ];
  return common.some((c) => lower.includes(c))
    || /^(.)\1+$/.test(pw)
    || /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh)/.test(lower);
}

function estimateCrackTime(entropy: number): string {
  // Assuming 10 billion guesses/sec (modern GPU cluster)
  const seconds = Math.pow(2, entropy) / 10_000_000_000;
  if (seconds < 0.001) return 'Instantly';
  if (seconds < 1) return `${Math.round(seconds * 1000)} milliseconds`;
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000).toLocaleString()} years`;
  return 'Millions of years';
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const result = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="space-y-8">
      {/* Privacy notice */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.1)' }}
      >
        <svg className="w-4 h-4 shrink-0" style={{ color: '#34D399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-xs" style={{ color: '#6EE7B7' }}>
          Your password is analyzed entirely in your browser. Nothing is sent to any server.
        </span>
      </div>

      {/* Password input */}
      <div>
        <label className="block text-[13px] font-medium tracking-wide uppercase mb-2.5" style={{ color: '#A0B0D0' }}>
          Enter your password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste your password..."
            className="w-full min-h-[56px] px-4 py-3 pr-12 rounded-xl text-lg text-white placeholder-[#5B6B8A] transition-all duration-200 focus:outline-none"
            style={{
              background: '#141B3C',
              border: `1px solid ${password ? result.color + '40' : '#1F2847'}`,
              boxShadow: password ? `0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px ${result.color}15` : '0 4px 16px rgba(0,0,0,0.3)',
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ color: '#5B6B8A' }}
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Strength bar */}
      {password && (
        <div className="space-y-6" style={{ animation: 'fade-in 0.3s ease-out' }}>
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: result.color }}>{result.label}</span>
              <span className="text-sm font-mono" style={{ color: '#5B6B8A' }}>{result.score}/100</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(31,40,71,0.8)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${result.score}%`,
                  background: `linear-gradient(90deg, ${result.gradientFrom}, ${result.gradientTo})`,
                  boxShadow: `0 0 12px ${result.color}60`,
                }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(31,40,71,0.4)', border: '1px solid rgba(31,40,71,0.8)' }}>
              <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#5B6B8A' }}>Entropy</p>
              <p className="text-lg font-bold font-mono text-white">{result.entropy} bits</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(31,40,71,0.4)', border: '1px solid rgba(31,40,71,0.8)' }}>
              <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#5B6B8A' }}>Length</p>
              <p className="text-lg font-bold font-mono text-white">{password.length} chars</p>
            </div>
            <div className="p-4 rounded-xl col-span-2 sm:col-span-1" style={{ background: 'rgba(31,40,71,0.4)', border: '1px solid rgba(31,40,71,0.8)' }}>
              <p className="text-[11px] font-medium tracking-widest uppercase mb-1" style={{ color: '#5B6B8A' }}>Crack time</p>
              <p className="text-lg font-bold font-mono" style={{ color: result.color }}>{result.crackTime}</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium" style={{ color: '#A0B0D0' }}>Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {result.checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2.5 py-1.5">
                  {check.passed ? (
                    <svg className="w-4 h-4 shrink-0" style={{ color: '#34D399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0" style={{ color: '#5B6B8A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    </svg>
                  )}
                  <span className="text-sm" style={{ color: check.passed ? '#d4d4d8' : '#5B6B8A' }}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {result.tips.length > 0 && (
            <div className="p-5 rounded-xl space-y-3" style={{ background: 'rgba(251, 191, 36, 0.06)', border: '1px solid rgba(251, 191, 36, 0.12)' }}>
              <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: '#FBBF24' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Improvement tips
              </h3>
              <ul className="space-y-1.5">
                {result.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm" style={{ color: '#d4d4d8' }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: '#FBBF24' }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
