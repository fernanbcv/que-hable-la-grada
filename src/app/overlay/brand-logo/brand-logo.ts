import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  styleUrl: './brand-logo.scss',
  templateUrl: './brand-logo.html',
  host: { '[style.--logo]': 'logoUrl()' },
})
export class BrandLogo {
  readonly name = input('LORENGONCA');
  readonly src = input('images/logos/lorengonca_escudo.png');

  /** Lets the stylesheet reuse the image as a mask for the shine and as the spinning ball. */
  protected readonly logoUrl = computed(() => `url("${this.src()}")`);
}
