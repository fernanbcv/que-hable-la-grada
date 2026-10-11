import { Component, input } from '@angular/core';

@Component({
  selector: 'app-show-title',
  styleUrl: './show-title.scss',
  templateUrl: './show-title.html',
})
export class ShowTitle {
  readonly line = input('QUE HABLE');
  readonly highlight = input('LA GRADA');
}
