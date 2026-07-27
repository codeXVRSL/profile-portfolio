import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class ExperienceComponent {
  protected readonly profile = profile;
}
