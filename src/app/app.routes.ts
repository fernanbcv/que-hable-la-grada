import { Routes } from '@angular/router';
import { OVERLAY_ELEMENTS, Overlay } from './overlay/overlay';

export const routes: Routes = [
  { path: '', component: Overlay },
  ...OVERLAY_ELEMENTS.map((element) => ({ path: element, component: Overlay, data: { element } })),
  { path: '**', redirectTo: '' },
];
