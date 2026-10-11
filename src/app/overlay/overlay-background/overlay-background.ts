import { Component } from '@angular/core';
import { CAMERA, STAGE } from '../overlay-layout';

@Component({
  selector: 'app-overlay-background',
  styleUrl: './overlay-background.scss',
  templateUrl: './overlay-background.html',
  host: { '[style.clip-path]': 'clipPath' },
})
export class OverlayBackground {
  /** Full canvas minus a rounded hole for the camera, so the OBS source underneath shows through. */
  protected readonly clipPath = cameraHolePath();
}

function cameraHolePath(): string {
  const inset = CAMERA.border - 1;
  const r = CAMERA.radius - inset;
  const left = CAMERA.x + inset;
  const top = CAMERA.y + inset;
  const right = CAMERA.x + CAMERA.width - inset;
  const bottom = CAMERA.y + CAMERA.height - inset;

  const canvas = `M0 0H${STAGE.width}V${STAGE.height}H0Z`;
  const hole =
    `M${left + r} ${top}H${right - r}A${r} ${r} 0 0 1 ${right} ${top + r}` +
    `V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}` +
    `H${left + r}A${r} ${r} 0 0 1 ${left} ${bottom - r}` +
    `V${top + r}A${r} ${r} 0 0 1 ${left + r} ${top}Z`;

  return `path(evenodd, "${canvas} ${hole}")`;
}
