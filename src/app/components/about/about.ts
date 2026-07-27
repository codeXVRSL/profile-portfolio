import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective, CountUpDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  protected readonly profile = profile;
}
