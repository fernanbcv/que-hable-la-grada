import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';

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
  readonly label = input('CON EL APOYO DE');
  readonly sponsors = input(DEFAULT_SPONSORS);
  /** Milliseconds each sponsor stays in place before the row advances. */
  readonly interval = input(2500);

  protected readonly sliding = signal(false);
  private readonly first = signal(0);

  /** The visible sponsors plus the next one waiting off-screen, starting at `first`. */
  protected readonly row = computed(() => {
    const sponsors = this.sponsors();
    if (sponsors.length === 0) {
      return [];
    }
    const count = sponsors.length > VISIBLE ? VISIBLE + 1 : sponsors.length;
    return Array.from({ length: count }, (_, i) => {
      const index = (this.first() + i) % sponsors.length;
      return { key: index, sponsor: sponsors[index] };
    });
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    let timer: ReturnType<typeof setInterval> | undefined;

    effect(() => {
      clearInterval(timer);
      if (this.sponsors().length > VISIBLE) {
        timer = setInterval(() => this.sliding.set(true), this.interval());
      }
    });
    destroyRef.onDestroy(() => clearInterval(timer));
  }

  protected onSlideEnd(): void {
    if (!this.sliding()) {
      return;
    }
    this.sliding.set(false);
    this.first.update((first) => (first + 1) % this.sponsors().length);
  }
}
