// The backend stores no cover art, so every track/album gets a stable gradient
// derived from its title. Same title always gives the same cover.
const PALETTES = [
  ["#ff7e5f", "#6a0f49"],
  ["#ffc93c", "#c2410c"],
  ["#7cf4c4", "#0f5c6e"],
  ["#a78bfa", "#1e1b4b"],
  ["#f472b6", "#581c87"],
  ["#60a5fa", "#134e4a"],
  ["#fb7185", "#7c2d12"],
  ["#c4b5fd", "#be185d"],
  ["#fde68a", "#7e22ce"],
  ["#5eead4", "#312e81"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function coverStyle(seed = "?") {
  const h = hash(String(seed));
  const [a, b] = PALETTES[h % PALETTES.length];
  const angle = (h >> 3) % 360;
  return { backgroundImage: `linear-gradient(${angle}deg, ${a}, ${b})` };
}
