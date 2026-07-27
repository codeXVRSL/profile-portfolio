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

/**
 * Splits the host's text into words and lifts them out of an overflow mask.
 * Words are wrapped at runtime so the source templates stay plain text.
 */
@Directive({
  selector: '[appMaskReveal]',
  standalone: true,
})
export class MaskRevealDirective implements AfterViewInit, OnDestroy {
  @Input() maskDelay = 0;
  @Input() maskStagger = 0.055;
  /** Play immediately instead of waiting for the element to scroll into view. */
  @Input() maskImmediate = false;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.host.nativeElement as HTMLElement;
    if (!canAnimate()) {
      el.style.visibility = 'visible';
      return;
    }

    registerMotion();

    const words = this.splitWords(el);
    if (!words.length) return;

    this.zone.runOutsideAngular(() => {
      gsap.set(words, { yPercent: 115 });
      el.style.visibility = 'visible';

      const animate = () => {
        this.tween = gsap.to(words, {
          yPercent: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: this.maskStagger,
          delay: this.maskDelay,
        });
      };

      if (this.maskImmediate) {
        animate();
        return;
      }

      this.trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: animate,
      });
    });
  }

  private splitWords(el: HTMLElement): HTMLElement[] {
    const words: HTMLElement[] = [];

    const wrapTextNode = (node: Text) => {
      const parts = node.textContent?.split(/(\s+)/) ?? [];
      const fragment = document.createDocumentFragment();

      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          continue;
        }
        const mask = document.createElement('span');
        mask.className = 'mask-word';
        const inner = document.createElement('span');
        inner.className = 'mask-word-inner';
        inner.textContent = part;
        mask.appendChild(inner);
        fragment.appendChild(mask);
        words.push(inner);
      }

      node.parentNode?.replaceChild(fragment, node);
    };

    const walk = (parent: Node) => {
      for (const child of [...parent.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          wrapTextNode(child as Text);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const element = child as HTMLElement;
          if (element.classList.contains('mask-word')) continue;
          walk(element);
        }
      }
    };

    walk(el);
    return words;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
    this.tween?.kill();
  }
}
