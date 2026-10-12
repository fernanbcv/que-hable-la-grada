import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-club-crest',
  styleUrl: './club-crest.scss',
  templateUrl: './club-crest.html',
  host: { '[style.--crest]': 'crestUrl()' },
})
export class ClubCrest {
  readonly name = input('CD Extremadura');
  readonly src = input('images/logos/logo_cdExtremadura.png');

  /** Lets the stylesheet reuse the image as a mask for the shine. */
  protected readonly crestUrl = computed(() => `url("${this.src()}")`);
}
