import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'night' | 'light';

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<Theme>('night');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let stored: string | null = null;
    try {
      stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      stored = null;
    }

    this.apply(stored === 'light' ? 'light' : 'night');
  }

  toggle(): void {
    this.apply(this.theme() === 'night' ? 'light' : 'night');
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    const root = this.document.documentElement;

    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#fafafa' : '#0b0b0c');

    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable — the in-memory signal still drives the UI */
    }
  }
}
