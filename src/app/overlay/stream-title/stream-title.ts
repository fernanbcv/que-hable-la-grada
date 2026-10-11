import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stream-title',
  styleUrl: './stream-title.scss',
  templateUrl: './stream-title.html',
})
export class StreamTitle {
  readonly channel = input('LORENGONCA');
  readonly topic = input('ACTUALIDAD AZULGRANA');
}
