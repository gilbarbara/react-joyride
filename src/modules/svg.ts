export function generateOverlayPath(
  overlayWidth: number,
  overlayHeight: number,
  cutout: string,
): string {
  let path = `M0 0H${overlayWidth}V${overlayHeight}H0Z`;

  if (cutout) {
    path += ` ${cutout}`;
  }

  return path;
}

export function generateSpotlightPath(
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number,
): string {
  if (width <= 0 || height <= 0) {
    return '';
  }

  const r = Math.max(0, Math.min(borderRadius, width / 2, height / 2));

  let path = `M${x + r} ${y}`;

  path += `H${x + width - r}`;
  path += `A${r} ${r} 0 0 1 ${x + width} ${y + r}`;
  path += `V${y + height - r}`;
  path += `A${r} ${r} 0 0 1 ${x + width - r} ${y + height}`;
  path += `H${x + r}`;
  path += `A${r} ${r} 0 0 1 ${x} ${y + height - r}`;
  path += `V${y + r}`;
  path += `A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

  return path;
}
