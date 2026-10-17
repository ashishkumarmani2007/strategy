export interface MicSignalStats {
  volume: number; // 0..100
  snrEstimate: number; // dB or relative
  isSpeaking: boolean;
  frequencyCentroid: number;
  demoScore: number; // clearly labelled demo score
  rawWaveform: number[];
}

export class MicEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private onStatsCallback: ((stats: MicSignalStats) => void) | null = null;

  async start(onStats: (stats: MicSignalStats) => void): Promise<{ success: boolean; error?: string }> {
    this.stop();
    this.onStatsCallback = onStats;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, error: 'Web Audio / Microphone API not supported in this browser environment.' };
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.stream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const tick = () => {
        if (!this.analyser) return;

        this.analyser.getByteTimeDomainData(dataArray);

        // Calculate RMS Volume
        let sum = 0;
        const waveform: number[] = [];
        for (let i = 0; i < bufferLength; i++) {
          const normalized = (dataArray[i] - 128) / 128; // -1 to 1
          sum += normalized * normalized;
          if (i % 4 === 0) {
            waveform.push(normalized);
          }
        }
        const rms = Math.sqrt(sum / bufferLength);
        const volume = Math.min(100, Math.round(rms * 280));
        const isSpeaking = volume > 10;

        // Deterministic mock demo score based on ambient volume fluctuation
        // Always explicit that this is for demo UI verification only
        const demoScore = isSpeaking ? Number((0.15 + (volume % 20) / 100).toFixed(2)) : 0.05;

        if (this.onStatsCallback) {
          this.onStatsCallback({
            volume,
            snrEstimate: Math.round(volume * 0.4 + 15),
            isSpeaking,
            frequencyCentroid: 450 + volume * 10,
            demoScore,
            rawWaveform: waveform,
          });
        }

        this.animFrameId = requestAnimationFrame(tick);
      };

      tick();
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Microphone access was denied or unavailable.';
      return { success: false, error: errorMsg };
    }
  }

  stop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.onStatsCallback = null;
  }
}
