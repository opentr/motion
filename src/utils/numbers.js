export function compareReal(a, b, margin) {
  if (Math.abs((a - b) * 10000) > margin * 1000) {
    return true;
  }
  return false;
}

export function regionDifferent(a, b) {
  return (
    compareReal(a.latitude, b.latitude, 0.0002) ||
    compareReal(a.longitude, b.longitude, 0.0002) ||
    compareReal(a.latitudeDelta, b.latitudeDelta, 0.0001) ||
    compareReal(a.longitudeDelta, b.longitudeDelta, 0.0001)
  );
}
