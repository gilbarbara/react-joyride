import { generateOverlayPath, generateSpotlightPath } from '~/modules/svg';

describe('generateSpotlightPath', () => {
  it('should generate a rounded rect path', () => {
    const path = generateSpotlightPath(100, 200, 300, 150, 4);

    expect(path).toContain('M104 200');
    expect(path).toContain('A4 4');
  });

  it('should return empty string when dimensions are 0', () => {
    expect(generateSpotlightPath(0, 0, 0, 0, 4)).toBe('');
  });

  it('should clamp borderRadius to half of smallest dimension', () => {
    const path = generateSpotlightPath(10, 10, 20, 10, 50);

    expect(path).toContain('A5 5');
  });

  it('should handle zero borderRadius', () => {
    const path = generateSpotlightPath(100, 200, 300, 150, 0);

    expect(path).toContain('A0 0');
  });
});

describe('generateOverlayPath', () => {
  it('should generate a path with cutout', () => {
    const cutout = generateSpotlightPath(100, 200, 300, 150, 4);
    const path = generateOverlayPath(1024, 768, cutout);

    expect(path).toContain('M0 0H1024V768H0Z');
    expect(path).toContain('M104 200');
  });

  it('should generate a path without cutout when empty string', () => {
    const path = generateOverlayPath(1024, 768, '');

    expect(path).toBe('M0 0H1024V768H0Z');
  });
});
