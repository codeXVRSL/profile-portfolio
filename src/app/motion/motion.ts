import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerMotion(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** Guarded media query — test environments and older engines lack matchMedia. */
export function matchesMedia(query: string): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches
  );
}

export function prefersReducedMotion(): boolean {
  return matchesMedia('(prefers-reduced-motion: reduce)');
}

/**
 * True only when animating is both wanted and possible. GSAP itself reaches for
 * matchMedia, so environments without it (tests, SSR) must skip motion entirely.
 */
export function canAnimate(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    !prefersReducedMotion()
  );
}

export function hasFinePointer(): boolean {
  return matchesMedia('(hover: hover) and (pointer: fine)');
}

export { gsap, ScrollTrigger };
