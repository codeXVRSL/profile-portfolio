import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollTrigger, canAnimate, gsap, registerMotion } from '../motion/motion';

/** Counts the leading number of the host's text up from zero when scrolled into view. */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input() countDuration = 1.4;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !canAnimate()) return;

    const el = this.host.nativeElement as HTMLElement;
    const original = el.textContent?.trim() ?? '';
    const match = original.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = Number(match[1]);
    const suffix = match[2];

    registerMotion();

    this.zone.runOutsideAngular(() => {
      const state = { value: 0 };
      el.textContent = `0${suffix}`;

      this.trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          this.tween = gsap.to(state, {
            value: target,
            duration: this.countDuration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${Math.round(state.value)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = original;
            },
          });
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.tween?.kill();
  }
}
