import { Component, input } from '@angular/core';

@Component({
  selector: 'app-live-badge',
  styleUrl: './live-badge.scss',
  templateUrl: './live-badge.html',
})
export class LiveBadge {
  readonly label = input('EN DIRECTO');
}
