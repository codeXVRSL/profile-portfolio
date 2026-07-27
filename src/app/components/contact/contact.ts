import { Component, signal } from '@angular/core';
import { profile } from '../../data/profile';
import { RevealDirective } from '../../directives/reveal.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, MaskRevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  protected readonly profile = profile;
  protected readonly copied = signal<string | null>(null);
  protected readonly currentYear = new Date().getFullYear();

  async copy(value: string, label: string, event: Event): Promise<void> {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(label);
      setTimeout(() => {
        if (this.copied() === label) this.copied.set(null);
      }, 1600);
    } catch {
      this.copied.set(null);
    }
  }
}
