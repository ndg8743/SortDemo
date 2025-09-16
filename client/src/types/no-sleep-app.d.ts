declare module 'no-sleep-app' {
  export interface NoSleepAppOptions {
    strategy?: 'video' | 'audio';
    video?: HTMLVideoElement;
    audio?: HTMLAudioElement;
    retryInterval?: number;
  }

  export default class NoSleepApp {
    constructor(options?: NoSleepAppOptions);
    enable(): void;
    disable(): void;
    get isEnabled(): boolean;
  }
}
