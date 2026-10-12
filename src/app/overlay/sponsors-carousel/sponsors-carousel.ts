import { Component, computed, effect, input, signal, untracked } from '@angular/core';

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

/** Panels of the board, each showing a different sponsor. */
const PANELS = 3;

@Component({
  selector: 'app-sponsors-carousel',
  styleUrl: './sponsors-carousel.scss',
  templateUrl: './sponsors-carousel.html',
})
export class SponsorsCarousel {
  readonly sponsors = input(DEFAULT_SPONSORS);
  /** Milliseconds a set of sponsors holds the board before a sweep of light brings in the next. */
  readonly interval = input(4000);

  /** How many times the board has changed. Each change moves on by a whole board of sponsors. */
  protected readonly step = signal(0);

  /**
   * The board on air on top of the one before it, which shows through until the sweep has crossed.
   * Tracked by step, so every new one is a new element and plays its entrance.
   */
  protected readonly layers = computed(() => {
    const sponsors = this.sponsors();
    const step = this.step();
    return (step ? [step - 1, step] : [step]).map((index) => ({
      step: index,
      onAir: index === step,
      sponsors: Array.from(
        { length: Math.min(PANELS, sponsors.length) },
        (_, panel) => sponsors[(index * PANELS + panel) % sponsors.length],
      ),
    }));
  });

  constructor() {
    // Restarts the board whenever its sponsors or its timing change
    effect((onCleanup) => {
      untracked(() => this.step.set(0));
      if (this.sponsors().length <= PANELS) {
        return;
      }
      const timer = setInterval(() => this.step.update((step) => step + 1), this.interval());
      onCleanup(() => clearInterval(timer));
    });
  }
}
