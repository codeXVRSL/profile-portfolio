import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import Lenis from 'lenis';
import { ScrollTrigger, canAnimate, registerMotion } from './motion/motion';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private lenis?: Lenis;
  private frame?: number;
  private anchorHandler?: (event: Event) => void;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.lenis) return;

    const win = this.document.defaultView;
    if (!win || !canAnimate()) return;
    // Lenis measures through ResizeObserver; without it, native scrolling stands in.
    if (typeof win.ResizeObserver === 'undefined') return;

    // Lenis drives scrolling itself; native smooth scrolling would fight it.
    this.document.documentElement.style.scrollBehavior = 'auto';

    this.lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });

    // Keep ScrollTrigger's cached positions in step with Lenis-driven scrolling.
    registerMotion();
    this.lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.frame = win.requestAnimationFrame(raf);
    };
    this.frame = win.requestAnimationFrame(raf);

    this.anchorHandler = (event: Event) => this.onAnchorClick(event);
    this.document.addEventListener('click', this.anchorHandler);
  }

  private onAnchorClick(event: Event): void {
    const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
    if (!anchor || !this.lenis) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = this.document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const navHeight = parseInt(
      getComputedStyle(this.document.documentElement).getPropertyValue('--nav-height'),
      10,
    );
    this.lenis.scrollTo(target as HTMLElement, {
      offset: -(Number.isNaN(navHeight) ? 68 : navHeight) - 16,
      duration: 1.4,
    });
  }

  ngOnDestroy(): void {
    if (this.anchorHandler) {
      this.document.removeEventListener('click', this.anchorHandler);
    }
    if (this.frame !== undefined) {
      this.document.defaultView?.cancelAnimationFrame(this.frame);
    }
    this.lenis?.destroy();
  }
}
