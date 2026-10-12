import { Component, input } from '@angular/core';

/** The show title in a hand-painted brush typeface. */
@Component({
  selector: 'app-show-title-brush',
  styleUrl: './show-title-brush.scss',
  templateUrl: '../show-title/show-title.html',
})
export class ShowTitleBrush {
  readonly line = input('QUE HABLE');
  readonly highlight = input('LA GRADA');
}
