import { DetectionEngine, ScenarioId, WindowResult } from './DetectionEngine';
import { SCENARIOS } from '../data/scenarios';

export class ScriptedEngine implements DetectionEngine {
  private timer: NodeJS.Timeout | null = null;
  private currentScenario: ScenarioId | null = null;
  private currentWindowIndex = 0;

  start(
    scenario: ScenarioId,
    onWindow: (r: WindowResult) => void,
    onComplete?: () => void,
    speedMultiplier: number = 1.0
  ): void {
    this.stop(); // Always clear previous run cleanly
    this.currentScenario = scenario;
    this.currentWindowIndex = 0;

    const scenarioDef = SCENARIOS[scenario];
    if (!scenarioDef) {
      console.error(`Scenario ${scenario} not found.`);
      return;
    }

    const intervalMs = Math.max(300, Math.round(1100 / speedMultiplier));

    const emitNextWindow = () => {
      if (this.currentWindowIndex < scenarioDef.windows.length) {
        const item = scenarioDef.windows[this.currentWindowIndex];
        const result: WindowResult = {
          index: this.currentWindowIndex,
          spoofScore: item.spoofScore,
          familyMatch: item.familyMatch,
          claimedMember: scenarioDef.claimedMember,
          callerNumber: scenarioDef.callerNumber,
          isRegisteredNumber: scenarioDef.isRegisteredNumber,
          transcriptSnippet: item.transcriptSnippet,
        };

        this.currentWindowIndex++;
        onWindow(result);

        if (this.currentWindowIndex < scenarioDef.windows.length) {
          this.timer = setTimeout(emitNextWindow, intervalMs);
        } else {
          this.timer = null;
          if (onComplete) onComplete();
        }
      }
    };

    // Emit first window immediately or after a short initial pause
    this.timer = setTimeout(emitNextWindow, 400);
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentWindowIndex = 0;
    this.currentScenario = null;
  }
}
