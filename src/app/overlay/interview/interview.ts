import { Component, computed, input } from '@angular/core';
import { CameraFrame } from '../camera-frame/camera-frame';
import { splitCamera } from '../overlay-layout';

@Component({
  imports: [CameraFrame],
  selector: 'app-interview',
  styleUrl: './interview.scss',
  templateUrl: './interview.html',
})
export class Interview {
  /** How many equal cameras to show in the camera area: 2, 3 or 4. */
  readonly participants = input(2);

  protected readonly cameras = computed(() => splitCamera(this.participants()));
}
