import { Component, computed, effect, input, signal, untracked } from '@angular/core';

export interface Sponsor {
  name: string;
  logo: string;
  /** Enlarges a logo whose file has a lot of empty space around the artwork. */
  scale?: number;
  /**
   * Takes over the whole board instead of a single panel. A tall logo would be tiny squeezed into
   * the board whole, so it is cut into these pieces and laid out side by side.
   */
  wide?: WideLogo;
  /** Takes over the whole board as the credit for whoever made the overlay, with their contact. */
  credit?: { email: string };
}

export interface WideLogo {
  /** Size in px of the logo file. */
  width: number;
  height: number;
  pieces: LogoPiece[];
}

/** A rectangle of a logo file, in px of the file, drawn at a height in % of the board. */
export interface LogoPiece {
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  /** A thin line in the sponsor's colour drawn before this piece. */
  divider?: boolean;
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

/** How many times as often each wide sponsor goes on air as each panelled one. */
const WIDE_SHARE = 2;

interface Board {
  /** A sponsor taking over the whole board, or else one sponsor per panel. */
  wide?: Sponsor;
  sponsors: Sponsor[];
}

@Component({
  selector: 'app-sponsors-carousel',
  styleUrl: './sponsors-carousel.scss',
  templateUrl: './sponsors-carousel.html',
})
export class SponsorsCarousel {
  readonly sponsors = input(DEFAULT_SPONSORS);
  /** Milliseconds a set of sponsors holds the board before a sweep of light brings in the next. */
  readonly interval = input(4000);
  /** Milliseconds a wide sponsor holds the board, longer than a set of panelled ones. */
  readonly wideInterval = input(8000);

  /** How many times the board has changed. Each change moves on by a whole board of sponsors. */
  protected readonly step = signal(0);

  /** Sponsors sharing the board, one per panel. */
  private readonly panelled = computed(() => this.sponsors().filter((sponsor) => !isWide(sponsor)));
  /** Sponsors that take over the whole board. */
  private readonly wide = computed(() => this.sponsors().filter(isWide));
  /**
   * One round of the board, after which it starts over. Long enough for every panelled sponsor to
   * be on air the same number of times, with the wide ones spread evenly between them, each going
   * on air WIDE_SHARE times as often as a panelled one and taking turns if there are several.
   */
  private readonly schedule = computed(() => {
    const panelled = this.panelled();
    const wide = this.wide();
    const perBoard = Math.min(PANELS, panelled.length);
    const boards = panelled.length <= PANELS ? 1 : panelled.length / gcd(panelled.length, PANELS);
    const shows = panelled.length ? (boards * perBoard) / panelled.length : 1;
    const wideBoards = wide.length * shows * WIDE_SHARE;

    const schedule: Board[] = [];
    let turn = 0;
    for (let board = 0; board < boards; board++) {
      if (panelled.length) {
        schedule.push({
          sponsors: Array.from(
            { length: perBoard },
            (_, panel) => panelled[(board * PANELS + panel) % panelled.length],
          ),
        });
      }
      const after =
        Math.floor(((board + 1) * wideBoards) / boards) - Math.floor((board * wideBoards) / boards);
      for (let i = 0; i < after; i++) {
        schedule.push({ wide: wide[turn++ % wide.length], sponsors: [] });
      }
    }
    return schedule;
  });

  /**
   * The board on air on top of the one before it, which shows through until the sweep has crossed.
   * Tracked by step, so every new one is a new element and plays its entrance.
   */
  protected readonly layers = computed(() => {
    const step = this.step();
    return (step ? [step - 1, step] : [step]).map((index) => ({
      step: index,
      onAir: index === step,
      ...this.board(index),
    }));
  });

  constructor() {
    // Restarts the board whenever its sponsors or its timing change
    effect((onCleanup) => {
      const schedule = this.schedule();
      const interval = this.interval();
      const wideInterval = this.wideInterval();
      untracked(() => this.step.set(0));
      if (schedule.length <= 1) {
        return;
      }
      // Each board holds for its own time before the next one comes in
      let timer: ReturnType<typeof setTimeout>;
      const next = () => {
        const onAir = this.board(untracked(this.step));
        timer = setTimeout(
          () => {
            this.step.update((step) => step + 1);
            next();
          },
          onAir.wide ? wideInterval : interval,
        );
      };
      next();
      onCleanup(() => clearTimeout(timer));
    });
  }

  /** CSS for a piece of a wide logo: that rectangle of the file, at its height on the board. */
  protected pieceStyle(sponsor: Sponsor, piece: LogoPiece): Record<string, string> {
    const file = sponsor.wide!;
    const offset = (start: number, length: number, total: number) =>
      total === length ? 0 : (start / (total - length)) * 100;
    return {
      'background-image': `url(${sponsor.logo})`,
      'background-size': `${(file.width / piece.width) * 100}% auto`,
      'background-position': `${offset(piece.x, piece.width, file.width)}% ${offset(piece.y, piece.height, file.height)}%`,
      'aspect-ratio': `${piece.width} / ${piece.height}`,
      height: `${piece.size}%`,
    };
  }

  private board(index: number): Board {
    const schedule = this.schedule();
    return schedule[index % schedule.length];
  }
}

function isWide(sponsor: Sponsor): boolean {
  return !!(sponsor.wide || sponsor.credit);
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
