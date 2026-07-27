import { Component, HostListener, inject, signal } from '@angular/core';
import { profile } from '../../data/profile';
import { ThemeService } from '../../theme';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class NavComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly profile = profile;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly theme = this.themeService.theme;
  protected readonly links = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
