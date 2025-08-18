declare module 'aplayer' {
  interface APlayerAudio {
    name: string;
    artist: string;
    url: string;
    cover?: string;
    lrc?: string;
    theme?: string;
    type?: string;
  }

  interface APlayerOptions {
    container: HTMLElement;
    audio: APlayerAudio[];
    autoplay?: boolean;
    fixed?: boolean;
    mini?: boolean;
    theme?: string;
    loop?: 'all' | 'one' | 'none';
    order?: 'list' | 'random';
    preload?: 'auto' | 'metadata' | 'none';
    volume?: number;
    mutex?: boolean;
    lrcType?: number;
    listFolded?: boolean;
    listMaxHeight?: string;
    storageName?: string;
  }

  export default class APlayer {
    constructor(options: APlayerOptions);
    destroy(): void;
    play(): void;
    pause(): void;
    toggle(): void;
    seek(time: number): void;
    on(event: string, handler: (...args: any[]) => void): void;
    // Tambahkan metode lain jika diperlukan
  }
}
