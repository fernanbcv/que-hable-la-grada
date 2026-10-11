import { Component, input } from '@angular/core';
import { CAMERA } from '../overlay-layout';

@Component({
  selector: 'app-camera-frame',
  styleUrl: './camera-frame.scss',
  templateUrl: './camera-frame.html',
  host: {
    '[style.left.px]': 'camera.x',
    '[style.top.px]': 'camera.y',
    '[style.width.px]': 'camera.width',
    '[style.height.px]': 'camera.height',
    '[style.border-width.px]': 'camera.border',
    '[style.border-radius.px]': 'camera.radius',
  },
})
export class CameraFrame {
  /** Optional video to play inside the frame. Leave empty in OBS so the camera source shows through. */
  readonly src = input<string>();

  protected readonly camera = CAMERA;
}
