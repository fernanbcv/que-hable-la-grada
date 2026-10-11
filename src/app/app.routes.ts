import { Routes } from '@angular/router';
import { INTERVIEW_SIZES, OVERLAY_ELEMENTS, Overlay } from './overlay/overlay';

export const routes: Routes = [
  { path: '', component: Overlay },
  ...OVERLAY_ELEMENTS.map((element) => ({ path: element, component: Overlay, data: { element } })),
  {
    path: 'entrevista/:participantes',
    component: Overlay,
    canMatch: [(_route, segments) => INTERVIEW_SIZES.includes(Number(segments[1].path))],
  },
  { path: '**', redirectTo: '' },
];
