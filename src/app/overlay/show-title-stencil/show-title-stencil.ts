import { Component, input } from '@angular/core';

/** The show title in a military stencil typeface. */
@Component({
  selector: 'app-show-title-stencil',
  styleUrl: './show-title-stencil.scss',
  templateUrl: '../show-title/show-title.html',
})
export class ShowTitleStencil {
  readonly line = input('QUE HABLE');
  readonly highlight = input('LA GRADA');
}
