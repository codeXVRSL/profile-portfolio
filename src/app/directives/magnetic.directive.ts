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
import { canAnimate, gsap, hasFinePointer } from '../motion/motion';

/** Pulls an element gently toward the cursor while hovered. */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  @Input() magneticStrength = 0.35;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private moveX?: (value: number) => void;
  private moveY?: (value: number) => void;
  private onMove?: (event: MouseEvent) => void;
  private onLeave?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !canAnimate()) return;
    if (!hasFinePointer()) return;

    const el = this.host.nativeElement as HTMLElement;

    this.zone.runOutsideAngular(() => {
      this.moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      this.moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      this.onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        this.moveX?.(dx * this.magneticStrength);
        this.moveY?.(dy * this.magneticStrength);
      };

      this.onLeave = () => {
        this.moveX?.(0);
        this.moveY?.(0);
      };

      el.addEventListener('mousemove', this.onMove);
      el.addEventListener('mouseleave', this.onLeave);
    });
  }

  ngOnDestroy(): void {
    const el = this.host.nativeElement as HTMLElement;
    if (this.onMove) el.removeEventListener('mousemove', this.onMove);
    if (this.onLeave) el.removeEventListener('mouseleave', this.onLeave);
    gsap.killTweensOf(el);
  }
}
