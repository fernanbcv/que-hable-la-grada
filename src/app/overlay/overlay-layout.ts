/** Size of the overlay canvas, in px. */
export const STAGE = { width: 1920, height: 1080 };

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Window space left over on each side of the canvas when the window is not 16:9, in canvas px. */
export interface Bleed {
  x: number;
  y: number;
}

/** Where the camera sits on the canvas. The background leaves this area transparent. */
export const CAMERA = { x: 358, y: 26, width: 1537, height: 866, radius: 18, border: 3 };

/** Space between cameras when the camera area is split for an interview. */
const CAMERA_GAP = 14;

/**
 * Splits the camera area into cameras the size of a 2x2 grid cell: 2 make one row centred
 * vertically, 3 are two on top and one centred underneath (a triangle) and 4 fill the grid.
 * Any other count gives the single full-size camera.
 */
export function splitCamera(count: number): Rect[] {
  if (count < 2 || count > 4) {
    return [{ x: CAMERA.x, y: CAMERA.y, width: CAMERA.width, height: CAMERA.height }];
  }

  // Whole pixels so every border stays sharp
  const width = Math.floor((CAMERA.width - CAMERA_GAP) / 2);
  const height = Math.floor((CAMERA.height - CAMERA_GAP) / 2);
  const right = CAMERA.x + CAMERA.width - width;
  const bottom = CAMERA.y + CAMERA.height - height;
  const centre = CAMERA.x + Math.round((CAMERA.width - width) / 2);

  // A single row sits in the middle of the camera area instead of at the top
  const top = count === 2 ? CAMERA.y + Math.round((CAMERA.height - height) / 2) : CAMERA.y;

  const cameras: Rect[] = [
    { x: CAMERA.x, y: top, width, height },
    { x: right, y: top, width, height },
  ];
  if (count === 3) {
    cameras.push({ x: centre, y: bottom, width, height });
  }
  if (count === 4) {
    cameras.push({ x: CAMERA.x, y: bottom, width, height }, { x: right, y: bottom, width, height });
  }
  return cameras;
}
