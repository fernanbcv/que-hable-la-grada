import { Component, computed, input } from '@angular/core';

export interface Sponsor {
  name: string;
  logo: string;
  /** Enlarges a logo whose file has a lot of empty space around the artwork. */
  scale?: number;
}

const DEFAULT_SPONSORS: Sponsor[] = [
  { name: 'Piscinas Calero', logo: 'images/sponsors/piscinas_calero.png' },
  { name: 'Soldal & Inox', logo: 'images/sponsors/soldal_inox.png', scale: 1.7 },
  { name: 'Villena Albañilería & Reformas', logo: 'images/sponsors/villena.png' },
  { name: 'Zamcar Carretillas', logo: 'images/sponsors/zamcar.png', scale: 1.6 },
  { name: 'Strata Hormigones y Pavimentos', logo: 'images/sponsors/strata.png' },
  { name: 'AlgeaSalud', logo: 'images/sponsors/algeasalud.png' },
  { name: 'Solimet', logo: 'images/sponsors/solimet.png', scale: 1.3 },
];

const VISIBLE = 3;

@Component({
  selector: 'app-sponsors-carousel',
  styleUrl: './sponsors-carousel.scss',
  templateUrl: './sponsors-carousel.html',
})
export class SponsorsCarousel {
  readonly sponsors = input(DEFAULT_SPONSORS);
  /** Milliseconds the belt takes to move one sponsor along. */
  readonly interval = input(2500);

  /** Whether there are more sponsors than fit, so they have to scroll. */
  protected readonly scrolling = computed(() => this.sponsors().length > VISIBLE);

  /** The sponsors, followed by a copy when scrolling so the belt loops without a gap. */
  protected readonly row = computed(() => {
    const sponsors = this.sponsors().map((sponsor) => ({ sponsor, copy: false }));
    return this.scrolling()
      ? [...sponsors, ...sponsors.map((item) => ({ ...item, copy: true }))]
      : sponsors;
  });

  /** One full loop moves every sponsor past, so it lasts one interval per sponsor. */
  protected readonly loop = computed(() => this.interval() * this.sponsors().length);
}
