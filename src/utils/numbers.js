export function compareReal(a, b, margin) {
  if (Math.abs((a - b) * 10000) > margin * 10000) {
    return true;
  }
  return false;
}

export function regionDifferent(a, b, diff = 0.0002) {
  return (
    compareReal(a.latitude, b.latitude, diff) ||
    compareReal(a.longitude, b.longitude, diff) ||
    compareReal(a.latitudeDelta, b.latitudeDelta, diff / 2) ||
    compareReal(a.longitudeDelta, b.longitudeDelta, diff / 2)
  );
}
