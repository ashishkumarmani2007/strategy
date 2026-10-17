export type ScenarioId = 'real' | 'clone' | 'unclear';

export type DecisionType = 'ANALYZING' | 'LIKELY_REAL' | 'POSSIBLE_AI' | 'UNCERTAIN';

export interface WindowResult {
  index: number;            // 0-based 3-second window
  spoofScore: number;       // 0..1, higher = more likely AI-generated
  familyMatch: number;      // 0..1 similarity to claimed family member's voiceprint
  claimedMember?: string;
  callerNumber?: string;
  isRegisteredNumber?: boolean;
  transcriptSnippet?: string;
}

export interface Decision {
  type: DecisionType;
  smoothedScore: number;
  rawScore: number;
  familyMatch: number;
  reasons: string[];
  recommendedAction: string;
  windowIndex: number;
}

export interface DetectionEngine {
  start(
    scenario: ScenarioId,
    onWindow: (r: WindowResult) => void,
    onComplete?: () => void,
    speedMultiplier?: number
  ): void;
  stop(): void;
}
