import { Component, computed, input } from '@angular/core';
import { CAMERA, Rect, STAGE } from '../overlay-layout';

@Component({
  selector: 'app-overlay-background',
  styleUrl: './overlay-background.scss',
  templateUrl: './overlay-background.html',
  host: { '[style.clip-path]': 'clipPath()' },
})
export class OverlayBackground {
  /** Camera areas to leave transparent. */
  readonly cameras = input<Rect[]>([CAMERA]);

  /** Full canvas minus a rounded hole per camera, so the OBS sources underneath show through. */
  protected readonly clipPath = computed(() => {
    const canvas = `M0 0H${STAGE.width}V${STAGE.height}H0Z`;
    return `path(evenodd, "${canvas} ${this.cameras().map(holePath).join(' ')}")`;
  });
}

function holePath(camera: Rect): string {
  const inset = CAMERA.border - 1;
  const r = CAMERA.radius - inset;
  const left = camera.x + inset;
  const top = camera.y + inset;
  const right = camera.x + camera.width - inset;
  const bottom = camera.y + camera.height - inset;

  return (
    `M${left + r} ${top}H${right - r}A${r} ${r} 0 0 1 ${right} ${top + r}` +
    `V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}` +
    `H${left + r}A${r} ${r} 0 0 1 ${left} ${bottom - r}` +
    `V${top + r}A${r} ${r} 0 0 1 ${left + r} ${top}Z`
  );
}
