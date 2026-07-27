import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class EducationComponent {
  protected readonly profile = profile;
}
