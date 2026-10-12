import { Component, computed, input } from '@angular/core';
import { Bleed, CAMERA, Rect, STAGE } from '../overlay-layout';

@Component({
  selector: 'app-overlay-background',
  styleUrl: './overlay-background.scss',
  templateUrl: './overlay-background.html',
  host: { '[style.inset]': 'inset()', '[style.clip-path]': 'clipPath()' },
})
export class OverlayBackground {
  /** Camera areas to leave transparent. */
  readonly cameras = input<Rect[]>([CAMERA]);
  /** How far to extend past the canvas on each side, so the background fills a window of any shape. */
  readonly bleed = input<Bleed>({ x: 0, y: 0 });

  protected readonly inset = computed(() => `${-this.bleed().y}px ${-this.bleed().x}px`);

  /** Canvas and bleed minus a rounded hole per camera, so the OBS sources underneath show through. */
  protected readonly clipPath = computed(() => {
    const bleed = this.bleed();
    const area = `M0 0H${STAGE.width + 2 * bleed.x}V${STAGE.height + 2 * bleed.y}H0Z`;
    const holes = this.cameras().map((camera) => holePath(camera, bleed));
    return `path(evenodd, "${area} ${holes.join(' ')}")`;
  });
}

function holePath(camera: Rect, bleed: Bleed): string {
  const inset = CAMERA.border - 1;
  const r = CAMERA.radius - inset;
  const left = bleed.x + camera.x + inset;
  const top = bleed.y + camera.y + inset;
  const right = bleed.x + camera.x + camera.width - inset;
  const bottom = bleed.y + camera.y + camera.height - inset;

  return (
    `M${left + r} ${top}H${right - r}A${r} ${r} 0 0 1 ${right} ${top + r}` +
    `V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}` +
    `H${left + r}A${r} ${r} 0 0 1 ${left} ${bottom - r}` +
    `V${top + r}A${r} ${r} 0 0 1 ${left + r} ${top}Z`
  );
}
