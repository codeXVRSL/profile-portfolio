import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { canAnimate, gsap, hasFinePointer } from '../../motion/motion';

const HOVER_SELECTOR = 'a, button, .project, .skill-row, .cert-card';

@Component({
  selector: 'app-cursor',
  standalone: true,
  templateUrl: './cursor.html',
  styleUrl: './cursor.css',
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private onMove?: (event: MouseEvent) => void;
  private onOver?: (event: MouseEvent) => void;
  private onOut?: (event: MouseEvent) => void;
  private onDown?: () => void;
  private onUp?: () => void;
  private enabled = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !canAnimate()) return;
    if (!hasFinePointer()) return;

    this.enabled = true;
    const dot = this.dotRef.nativeElement;
    const ring = this.ringRef.nativeElement;

    this.zone.runOutsideAngular(() => {
      document.documentElement.classList.add('has-custom-cursor');

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

      let visible = false;
      this.onMove = (event: MouseEvent) => {
        if (!visible) {
          visible = true;
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      this.onOver = (event: MouseEvent) => {
        if ((event.target as HTMLElement)?.closest?.(HOVER_SELECTOR)) {
          gsap.to(ring, { scale: 2.1, duration: 0.35, ease: 'power3.out' });
          gsap.to(dot, { scale: 0.4, duration: 0.35, ease: 'power3.out' });
        }
      };

      this.onOut = (event: MouseEvent) => {
        if ((event.target as HTMLElement)?.closest?.(HOVER_SELECTOR)) {
          gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power3.out' });
          gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power3.out' });
        }
      };

      this.onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2, ease: 'power3.out' });
      this.onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3.out' });

      window.addEventListener('mousemove', this.onMove, { passive: true });
      document.addEventListener('mouseover', this.onOver);
      document.addEventListener('mouseout', this.onOut);
      window.addEventListener('mousedown', this.onDown);
      window.addEventListener('mouseup', this.onUp);
    });
  }

  ngOnDestroy(): void {
    if (!this.enabled) return;
    if (this.onMove) window.removeEventListener('mousemove', this.onMove);
    if (this.onOver) document.removeEventListener('mouseover', this.onOver);
    if (this.onOut) document.removeEventListener('mouseout', this.onOut);
    if (this.onDown) window.removeEventListener('mousedown', this.onDown);
    if (this.onUp) window.removeEventListener('mouseup', this.onUp);
    document.documentElement.classList.remove('has-custom-cursor');
  }
}
