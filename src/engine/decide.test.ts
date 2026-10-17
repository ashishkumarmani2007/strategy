import { describe, it, expect } from 'vitest';
import { decide } from './decide';
import { WindowResult } from './DetectionEngine';

describe('decide() anti-spoof and family verification logic', () => {
  it('returns ANALYZING when no windows have been provided', () => {
    const decision = decide([]);
    expect(decision.type).toBe('ANALYZING');
    expect(decision.windowIndex).toBe(-1);
    expect(decision.smoothedScore).toBe(0);
  });

  it('classifies clearly real calls (smoothed < 0.30 and high family match)', () => {
    const windows: WindowResult[] = [
      { index: 0, spoofScore: 0.10, familyMatch: 0.93, claimedMember: 'Mom', isRegisteredNumber: true },
      { index: 1, spoofScore: 0.08, familyMatch: 0.95, claimedMember: 'Mom', isRegisteredNumber: true },
      { index: 2, spoofScore: 0.12, familyMatch: 0.94, claimedMember: 'Mom', isRegisteredNumber: true },
      { index: 3, spoofScore: 0.09, familyMatch: 0.96, claimedMember: 'Mom', isRegisteredNumber: true },
    ];
    const decision = decide(windows);
    expect(decision.type).toBe('LIKELY_REAL');
    expect(decision.smoothedScore).toBeLessThan(0.3);
    expect(decision.familyMatch).toBe(0.96);
    expect(decision.recommendedAction).toContain('Safe to talk');
  });

  it('classifies clearly AI / deepfake clone calls (smoothed > 0.70)', () => {
    const windows: WindowResult[] = [
      { index: 0, spoofScore: 0.35, familyMatch: 0.44, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 1, spoofScore: 0.52, familyMatch: 0.38, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 2, spoofScore: 0.71, familyMatch: 0.33, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 3, spoofScore: 0.84, familyMatch: 0.31, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 4, spoofScore: 0.88, familyMatch: 0.29, claimedMember: 'Rohan', isRegisteredNumber: false },
    ];
    const decision = decide(windows);
    expect(decision.type).toBe('POSSIBLE_AI');
    expect(decision.smoothedScore).toBeGreaterThan(0.7);
    expect(decision.recommendedAction).toContain('Hang up immediately');
  });

  it('classifies in-between / ambiguous calls as UNCERTAIN', () => {
    const windows: WindowResult[] = [
      { index: 0, spoofScore: 0.42, familyMatch: 0.74, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 1, spoofScore: 0.51, familyMatch: 0.69, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 2, spoofScore: 0.55, familyMatch: 0.72, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 3, spoofScore: 0.49, familyMatch: 0.70, claimedMember: 'Rohan', isRegisteredNumber: false },
      { index: 4, spoofScore: 0.53, familyMatch: 0.68, claimedMember: 'Rohan', isRegisteredNumber: false },
    ];
    const decision = decide(windows);
    expect(decision.type).toBe('UNCERTAIN');
    expect(decision.smoothedScore).toBeGreaterThanOrEqual(0.3);
    expect(decision.smoothedScore).toBeLessThanOrEqual(0.7);
    expect(decision.recommendedAction).toContain('safe word');
  });

  it('elevates risk when low family match (<50%) occurs with high spoof score', () => {
    const windows: WindowResult[] = [
      { index: 0, spoofScore: 0.75, familyMatch: 0.22, claimedMember: 'Dad', isRegisteredNumber: false },
      { index: 1, spoofScore: 0.82, familyMatch: 0.20, claimedMember: 'Dad', isRegisteredNumber: false },
      { index: 2, spoofScore: 0.89, familyMatch: 0.18, claimedMember: 'Dad', isRegisteredNumber: false },
    ];
    const decision = decide(windows);
    expect(decision.type).toBe('POSSIBLE_AI');
    expect(decision.reasons.some((r) => r.includes('low voiceprint similarity'))).toBe(true);
  });

  it('elevates LIKELY_REAL to UNCERTAIN when family voiceprint match is below 50%', () => {
    // Low acoustic spoof score (e.g. 0.15) but voice does NOT match enrolled relative!
    const windows: WindowResult[] = [
      { index: 0, spoofScore: 0.15, familyMatch: 0.35, claimedMember: 'Sister', isRegisteredNumber: true },
      { index: 1, spoofScore: 0.12, familyMatch: 0.32, claimedMember: 'Sister', isRegisteredNumber: true },
      { index: 2, spoofScore: 0.14, familyMatch: 0.30, claimedMember: 'Sister', isRegisteredNumber: true },
    ];
    const decision = decide(windows);
    expect(decision.type).toBe('UNCERTAIN');
    expect(decision.reasons.some((r) => r.includes('Elevated to UNCERTAIN'))).toBe(true);
  });

  it('handles moving-average edge cases with fewer than 3 windows', () => {
    // Exactly 1 window
    const singleWindow: WindowResult[] = [
      { index: 0, spoofScore: 0.10, familyMatch: 0.95, claimedMember: 'Mom', isRegisteredNumber: true },
    ];
    const dec1 = decide(singleWindow);
    expect(dec1.smoothedScore).toBe(0.1);
    expect(dec1.type).toBe('LIKELY_REAL');

    // Exactly 2 windows
    const twoWindows: WindowResult[] = [
      { index: 0, spoofScore: 0.80, familyMatch: 0.30, claimedMember: 'Unknown', isRegisteredNumber: false },
      { index: 1, spoofScore: 0.86, familyMatch: 0.28, claimedMember: 'Unknown', isRegisteredNumber: false },
    ];
    const dec2 = decide(twoWindows);
    expect(dec2.smoothedScore).toBe(0.83);
    expect(dec2.type).toBe('POSSIBLE_AI');
  });
});
