import { Component, computed, input, signal } from '@angular/core';
import { BrandLogo } from './brand-logo/brand-logo';
import { CameraFrame } from './camera-frame/camera-frame';
import { ChatBox } from './chat-box/chat-box';
import { Interview } from './interview/interview';
import { LiveBadge } from './live-badge/live-badge';
import { OverlayBackground } from './overlay-background/overlay-background';
import { Bleed, STAGE, splitCamera } from './overlay-layout';
import { ScheduleCard } from './schedule-card/schedule-card';
import { ShowTitle } from './show-title/show-title';
import { SocialLinks } from './social-links/social-links';
import { SponsorsCarousel } from './sponsors-carousel/sponsors-carousel';
import { StreamTitle } from './stream-title/stream-title';

/** URL of each overlay element, e.g. /carrusel shows only the sponsors carousel. */
export const OVERLAY_ELEMENTS = [
  'fondo',
  'logo',
  'titulo',
  'chat',
  'redes',
  'horario',
  'camara',
  'en-directo',
  'rotulo',
  'carrusel',
] as const;

export type OverlayElement = (typeof OVERLAY_ELEMENTS)[number];

/** Valid values for /entrevista/:participantes. */
export const INTERVIEW_SIZES = [2, 3, 4];

@Component({
  imports: [
    BrandLogo,
    CameraFrame,
    ChatBox,
    Interview,
    LiveBadge,
    OverlayBackground,
    ScheduleCard,
    ShowTitle,
    SocialLinks,
    SponsorsCarousel,
    StreamTitle,
  ],
  selector: 'app-overlay',
  styleUrl: './overlay.scss',
  templateUrl: './overlay.html',
  host: { '(window:resize)': 'fit.set(fitStage())' },
})
export class Overlay {
  /** When set, only that element is drawn, in its usual place on a transparent canvas. */
  readonly element = input<OverlayElement>();
  /** Comes from /entrevista/:participantes. Shows 2, 3 or 4 equal cameras in the camera area. */
  readonly participantes = input<string>();

  /** Number of interview cameras, or 0 for the usual single camera. */
  protected readonly interview = computed(() => {
    const count = Number(this.participantes());
    return INTERVIEW_SIZES.includes(count) ? count : 0;
  });
  /** Holes to leave in the background. On its own at /fondo it is solid, with no camera area. */
  protected readonly cameras = computed(() =>
    this.element() === 'fondo' ? [] : splitCamera(this.interview()),
  );

  /**
   * Shrinks or grows the 1920x1080 canvas to fit the window and centres it. In a 1920x1080 OBS
   * browser source the scale is 1 and there is no bleed.
   */
  protected readonly fit = signal(fitStage());
  protected readonly fitStage = fitStage;
  protected readonly transform = computed(() => {
    const { scale, bleed } = this.fit();
    return `scale(${scale}) translate(${bleed.x}px, ${bleed.y}px)`;
  });

  protected shows(element: OverlayElement): boolean {
    const only = this.element();
    return !only || only === element;
  }
}

/** The scale of the canvas and the space left over on each side of it, in canvas px. */
function fitStage(): { scale: number; bleed: Bleed } {
  const scale = Math.min(window.innerWidth / STAGE.width, window.innerHeight / STAGE.height);
  return {
    scale,
    bleed: {
      x: (window.innerWidth / scale - STAGE.width) / 2,
      y: (window.innerHeight / scale - STAGE.height) / 2,
    },
  };
}
