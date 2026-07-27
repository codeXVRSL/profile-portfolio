import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavComponent } from './components/nav/nav';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { SkillsComponent } from './components/skills/skills';
import { ExperienceComponent } from './components/experience/experience';
import { ProjectsComponent } from './components/projects/projects';
import { EducationComponent } from './components/education/education';
import { ContactComponent } from './components/contact/contact';
import { CursorComponent } from './components/cursor/cursor';
import { SmoothScrollService } from './smooth-scroll';
import { ThemeService } from './theme';
import { ScrollTrigger, canAnimate, gsap, registerMotion } from './motion/motion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CursorComponent,
    NavComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('progressBar', { static: true }) progressBar!: ElementRef<HTMLElement>;

  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly themeService = inject(ThemeService);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.themeService.init();
    this.smoothScroll.init();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !canAnimate()) return;

    registerMotion();

    this.zone.runOutsideAngular(() => {
      gsap.to(this.progressBar.nativeElement, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      ScrollTrigger.refresh();
    });
  }
}
