import { WindowResult, Decision, DecisionType } from './DetectionEngine';

export interface DecideOptions {
  minWindowsForDecision?: number;
}

export function decide(
  windows: WindowResult[],
  options: DecideOptions = {}
): Decision {
  if (!windows || windows.length === 0) {
    return {
      type: 'ANALYZING',
      smoothedScore: 0,
      rawScore: 0,
      familyMatch: 0,
      reasons: ['Awaiting incoming call audio telemetry...'],
      recommendedAction: 'Listening to call audio stream...',
      windowIndex: -1,
    };
  }

  // Moving average of the last 3 windows (or fewer if edge case)
  const windowSlice = windows.slice(-3);
  const sumScores = windowSlice.reduce((acc, w) => acc + w.spoofScore, 0);
  const smoothedScore = Number((sumScores / windowSlice.length).toFixed(3));

  const latest = windows[windows.length - 1];
  const rawScore = latest.spoofScore;
  const familyMatch = latest.familyMatch;
  const reasons: string[] = [];

  let type: DecisionType = 'UNCERTAIN';

  if (smoothedScore > 0.7) {
    type = 'POSSIBLE_AI';
    reasons.push(`Acoustic spoof score (${smoothedScore.toFixed(2)}) exceeds 0.70 alert threshold.`);
  } else if (smoothedScore < 0.3) {
    type = 'LIKELY_REAL';
    reasons.push(`Acoustic spoof score (${smoothedScore.toFixed(2)}) remains in safe zone (< 0.30).`);
  } else {
    type = 'UNCERTAIN';
    reasons.push(`Acoustic spoof score (${smoothedScore.toFixed(2)}) is indeterminate between 0.30 and 0.70.`);
  }

  // Factor Family Voiceprint Match and Circle Registry
  if (latest.claimedMember) {
    if (familyMatch < 0.5) {
      reasons.push(
        `Claimed identity "${latest.claimedMember}" has low voiceprint similarity (${Math.round(
          familyMatch * 100
        )}% < 50%).`
      );

      // Low match elevates risk
      if (type === 'LIKELY_REAL') {
        type = 'UNCERTAIN';
        reasons.push('Elevated to UNCERTAIN due to voiceprint mismatch despite low raw spoof score.');
      } else if (type === 'UNCERTAIN' && (familyMatch < 0.4 || latest.isRegisteredNumber === false)) {
        type = 'POSSIBLE_AI';
        reasons.push('Elevated to POSSIBLE_AI: ambiguous spoof score paired with unverified voiceprint.');
      }
    } else {
      reasons.push(
        `High voiceprint correlation (${Math.round(familyMatch * 100)}%) with enrolled profile for ${
          latest.claimedMember
        }.`
      );
    }
  }

  if (latest.isRegisteredNumber === false) {
    reasons.push('Incoming call originates from an unregistered or unverified phone number.');
  }

  // Recommended actions
  let recommendedAction = '';
  switch (type) {
    case 'POSSIBLE_AI':
      recommendedAction = 'Hang up immediately, verify on registered family number, and engage payment lock.';
      break;
    case 'UNCERTAIN':
      recommendedAction = 'Ask for your confidential family safe word before taking any action.';
      break;
    case 'LIKELY_REAL':
      recommendedAction = 'Safe to talk. Caller voice and registered profile match.';
      break;
    default:
      recommendedAction = 'Analyzing 3-second call windows...';
  }

  return {
    type,
    smoothedScore,
    rawScore,
    familyMatch,
    reasons,
    recommendedAction,
    windowIndex: latest.index,
  };
}
