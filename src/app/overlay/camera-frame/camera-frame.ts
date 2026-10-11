import { Component, input } from '@angular/core';
import { CAMERA, Rect } from '../overlay-layout';

let nextId = 0;

@Component({
  selector: 'app-camera-frame',
  styleUrl: './camera-frame.scss',
  templateUrl: './camera-frame.html',
  host: {
    '[style.left.px]': 'rect().x',
    '[style.top.px]': 'rect().y',
    '[style.width.px]': 'rect().width',
    '[style.height.px]': 'rect().height',
    '[style.border-width.px]': 'camera.border',
    '[style.border-radius.px]': 'camera.radius',
  },
})
export class CameraFrame {
  /** Position and size on the canvas. Defaults to the single full-size camera. */
  readonly rect = input<Rect>(CAMERA);
  /** Optional video to play inside the frame. Leave empty in OBS so the camera source shows through. */
  readonly src = input<string>();

  protected readonly camera = CAMERA;

  // SVG gradient ids are global to the page, so each frame needs its own
  private readonly id = nextId++;
  protected readonly topGradient = `camera-accent-top-${this.id}`;
  protected readonly bottomGradient = `camera-accent-bottom-${this.id}`;
}
