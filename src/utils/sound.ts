/**
 * Real Human Voice Adhan & Prayer Notification Sound Engine
 * Supports high-fidelity authentic MP3 recordings of Makkah, Madinah, Al-Aqsa,
 * Fajr, and Mishary Alafasy, with custom user uploads and Web Audio synthesis fallback.
 */

export interface RealAdhanTrack {
  id: string;
  titleAr: string;
  reciterAr: string;
  src: string;
  durationEstimate?: string;
  isFajrOnly?: boolean;
}

export const REAL_ADHAN_TRACKS: RealAdhanTrack[] = [
  {
    id: 'makkah',
    titleAr: 'أذان المسجد الحرام (مكة المكرمة)',
    reciterAr: 'الشيخ علي أحمد ملا (شيخ مؤذني الحرم المكي)',
    src: '/audio/adhan_makkah.mp3',
    durationEstimate: '3:20 د',
  },
  {
    id: 'madina',
    titleAr: 'أذان المسجد النبوي الشريف',
    reciterAr: 'مؤذنو الحرم المدني الشريف (المدينة المنورة)',
    src: '/audio/adhan_madina.mp3',
    durationEstimate: '1:45 د',
  },
  {
    id: 'alaqsa',
    titleAr: 'أذان المسجد الأقصى المبارك',
    reciterAr: 'أذان القدس الشريف الخاشع',
    src: '/audio/adhan_alaqsa.mp3',
    durationEstimate: '3:45 د',
  },
  {
    id: 'fajr',
    titleAr: 'أذان الفجر الحقيقي (الصلاة خير من النوم)',
    reciterAr: 'نداء الفجر بصوت ندي خاشع',
    src: '/audio/adhan_fajr.mp3',
    durationEstimate: '3:30 د',
    isFajrOnly: true,
  },
  {
    id: 'mishary',
    titleAr: 'أذان بصوت الشيخ مشاري راشد العفاسي',
    reciterAr: 'الشيخ مشاري راشد العفاسي',
    src: '/audio/adhan_mishary.mp3',
    durationEstimate: '4:05 د',
  },
];

class AudioAdhanEngine {
  private ctx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentSourceNodes: (AudioNode | number)[] = [];
  private activeTrackId: string = 'makkah';

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stopAll() {
    this.isPlaying = false;

    // Stop real HTML5 Audio
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    // Clear Web Audio nodes and timeouts
    this.currentSourceNodes.forEach((node) => {
      if (typeof node === 'number') {
        clearTimeout(node);
      } else {
        try {
          (node as AudioScheduledSourceNode).stop?.();
        } catch {
          // ignore
        }
      }
    });
    this.currentSourceNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getActiveTrackId(): string {
    return this.activeTrackId;
  }

  /**
   * Play real recorded human Adhan audio (MP3 file)
   */
  public playRealAdhan(
    audioSrc: string = '/audio/adhan_makkah.mp3',
    volume: number = 0.8,
    onEnded?: () => void
  ): Promise<void> {
    this.stopAll();
    this.isPlaying = true;

    return new Promise((resolve) => {
      try {
        const audio = new Audio(audioSrc);
        this.currentAudioElement = audio;
        audio.volume = Math.max(0, Math.min(1, volume));

        audio.onended = () => {
          this.isPlaying = false;
          this.currentAudioElement = null;
          onEnded?.();
          resolve();
        };

        audio.onerror = (err) => {
          console.warn('Real audio file error, falling back to synthesizer:', err);
          this.playTakbirat(volume).then(() => {
            this.isPlaying = false;
            onEnded?.();
            resolve();
          });
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => resolve())
            .catch((err) => {
              console.warn('Audio play restricted by browser policy:', err);
              this.isPlaying = false;
              resolve();
            });
        }
      } catch (err) {
        console.error('Audio initialization error:', err);
        this.isPlaying = false;
        resolve();
      }
    });
  }

  /**
   * Play a gentle chime alert (تنبيه هادئ قبل الصلاة)
   */
  public playChime(volume: number = 0.5): Promise<void> {
    this.stopAll();
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);

      gain.gain.setValueAtTime(0.001, now + idx * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.3 * volume, now + idx * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 1.3);
      this.currentSourceNodes.push(osc);
    });

    return new Promise((res) => setTimeout(res, 2200));
  }

  /**
   * Play Takbirat (الله أكبر الله أكبر)
   */
  public playTakbirat(volume: number = 0.6): Promise<void> {
    this.stopAll();
    this.isPlaying = true;
    const ctx = this.getContext();

    const melody: { note: number; duration: number }[] = [
      { note: 349.23, duration: 0.6 },
      { note: 440.00, duration: 0.8 },
      { note: 392.00, duration: 1.1 },
      { note: 349.23, duration: 0.5 },
      { note: 349.23, duration: 0.6 },
      { note: 440.00, duration: 0.9 },
      { note: 392.00, duration: 1.3 },
    ];

    let offset = 0;
    melody.forEach((item) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + offset;
      const endTime = startTime + item.duration;

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(item.note, startTime);
      osc2.frequency.setValueAtTime(item.note * 2, startTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.4 * volume, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(endTime);
      osc2.stop(endTime);

      this.currentSourceNodes.push(osc1, osc2);
      offset += item.duration * 0.95;
    });

    return new Promise((res) => {
      const timeout = window.setTimeout(() => {
        this.isPlaying = false;
        res();
      }, offset * 1000 + 500);
      this.currentSourceNodes.push(timeout);
    });
  }

  /**
   * Play full Algerian Adhan melody (real MP3 with synthesized backup)
   */
  public playFullAdhan(volume: number = 0.8, onEnded?: () => void): void {
    // Prefer real MP3 recording of Makkah / Al-Aqsa
    this.playRealAdhan('/audio/adhan_makkah.mp3', volume, onEnded);
  }
}

export const adhanEngine = new AudioAdhanEngine();

/**
 * Request browser desktop notifications for prayer alerts
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const res = await Notification.requestPermission();
    return res === 'granted';
  }
  return false;
}

/**
 * Dispatch desktop notification with prayer details
 */
export function sendPrayerNotification(prayerNameAr: string, locationNameAr: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  try {
    new Notification(`حان الآن موعد صلاة ${prayerNameAr}`, {
      body: `بتوقيت ${locationNameAr} وضواحيها. تقبل الله منا ومنكم صالح الأعمال.`,
      icon: '/favicon.ico',
      dir: 'rtl',
      lang: 'ar',
    });
  } catch {
    // ignore
  }
}
