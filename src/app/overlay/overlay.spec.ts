import { TestBed } from '@angular/core/testing';
import { Overlay } from './overlay';

describe('Overlay', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overlay],
    })
      .compileComponents();
  });

  it('should render every element', async () => {
    const fixture = TestBed.createComponent(Overlay);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-show-title h1')?.textContent).toContain('QUE HABLE');
    expect(compiled.querySelector('app-camera-frame')).toBeTruthy();
    // The 7 sponsors twice over, so the belt loops without a gap
    expect(compiled.querySelectorAll('app-sponsors-carousel li').length).toBe(14);
    expect(compiled.querySelector('.stage')?.children.length).toBe(10);
  });

  it('should show one equal camera per interview participant', async () => {
    const fixture = TestBed.createComponent(Overlay);
    for (const participantes of [2, 3, 4]) {
      fixture.componentRef.setInput('participantes', String(participantes));
      await fixture.whenStable();
      const frames = [
        ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
          'app-interview app-camera-frame',
        ),
      ];
      expect(frames.length).toBe(participantes);
      // Every camera is one cell of the 2x2 grid, whatever the count
      expect(new Set(frames.map((frame) => frame.style.width))).toEqual(new Set(['761px']));
      expect(new Set(frames.map((frame) => frame.style.height))).toEqual(new Set(['426px']));
    }
  });

  it('should render only the requested element', async () => {
    const fixture = TestBed.createComponent(Overlay);
    fixture.componentRef.setInput('element', 'carrusel');
    await fixture.whenStable();
    const stage = (fixture.nativeElement as HTMLElement).querySelector('.stage');
    expect(stage?.children.length).toBe(1);
    expect(stage?.querySelector('app-sponsors-carousel')).toBeTruthy();
  });

  it('should leave a camera hole in the background only in the full overlay', async () => {
    const fixture = TestBed.createComponent(Overlay);
    await fixture.whenStable();
    const clipPath = () =>
      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-overlay-background')
        ?.style.clipPath ?? '';
    // One subpath for the canvas and one for the camera
    expect(clipPath().match(/M/g)?.length).toBe(2);

    fixture.componentRef.setInput('element', 'fondo');
    await fixture.whenStable();
    expect(clipPath().match(/M/g)?.length).toBe(1);
  });
});
