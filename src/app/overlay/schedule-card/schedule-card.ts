import { Component, input } from '@angular/core';

@Component({
  selector: 'app-schedule-card',
  styleUrl: './schedule-card.scss',
  templateUrl: './schedule-card.html',
})
export class ScheduleCard {
  readonly label = input('DIRECTOS · 19:00 H');
  readonly days = input('MIÉRCOLES Y DOMINGOS');
}
