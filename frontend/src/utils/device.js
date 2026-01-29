export function isDesktop() {
  return window.matchMedia("(pointer:fine)").matches;
}