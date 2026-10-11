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
    expect(compiled.querySelectorAll('app-sponsors-carousel li').length).toBe(4);
    expect(compiled.querySelector('.stage')?.children.length).toBe(10);
  });

  it('should render only the requested element', async () => {
    const fixture = TestBed.createComponent(Overlay);
    fixture.componentRef.setInput('element', 'carrusel');
    await fixture.whenStable();
    const stage = (fixture.nativeElement as HTMLElement).querySelector('.stage');
    expect(stage?.children.length).toBe(1);
    expect(stage?.querySelector('app-sponsors-carousel')).toBeTruthy();
  });
});
