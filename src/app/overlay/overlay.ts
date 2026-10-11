import { Component, input, signal } from '@angular/core';
import { BrandLogo } from './brand-logo/brand-logo';
import { CameraFrame } from './camera-frame/camera-frame';
import { ChatBox } from './chat-box/chat-box';
import { LiveBadge } from './live-badge/live-badge';
import { OverlayBackground } from './overlay-background/overlay-background';
import { STAGE } from './overlay-layout';
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

@Component({
  imports: [
    BrandLogo,
    CameraFrame,
    ChatBox,
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
  host: { '(window:resize)': 'scale.set(fitScale())' },
})
export class Overlay {
  /** When set, only that element is drawn, in its usual place on a transparent canvas. */
  readonly element = input<OverlayElement>();

  /** Shrinks or grows the 1920x1080 canvas to fit the window. It is 1 in a 1920x1080 OBS browser source. */
  protected readonly scale = signal(fitScale());
  protected readonly fitScale = fitScale;

  protected shows(element: OverlayElement): boolean {
    const only = this.element();
    return !only || only === element;
  }
}

function fitScale(): number {
  return Math.min(window.innerWidth / STAGE.width, window.innerHeight / STAGE.height);
}
