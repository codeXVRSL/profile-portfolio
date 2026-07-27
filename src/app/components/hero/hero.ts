import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective, MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroComponent {
  protected readonly profile = profile;
  protected readonly ticker = [
    'Angular',
    'TypeScript',
    '.NET Core',
    'Ionic',
    'SQL Server',
    'AWS',
    'Azure',
    'Firebase',
    'Power Platform',
    'Azure DevOps',
  ];
}
