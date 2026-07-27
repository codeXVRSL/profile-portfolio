import { Component } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class SkillsComponent {
  protected readonly profile = profile;
}
