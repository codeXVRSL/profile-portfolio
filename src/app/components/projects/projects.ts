import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  protected readonly profile = profile;
}
