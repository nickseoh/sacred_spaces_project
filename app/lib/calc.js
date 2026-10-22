// Same rough site math the browser shows, recomputed on the server so prompts use trusted numbers.
export const TYPES = {
  micro: { label: "micro-cottages", fpW: 16, fpD: 25, sqft: 400 },
  cottage: { label: "cottages", fpW: 24, fpD: 30, sqft: 700 },
  town: { label: "townhomes", fpW: 20, fpD: 36, sqft: 1400 },
};
const STALL = 330;
const n = (v, max) => Math.min(max, Math.max(0, Number(v) || 0));
const str = (v, max) => String(v ?? "").slice(0, max).trim();

export function cleanInputs(raw = {}) {
  return {
    church: str(raw.church, 120), address: str(raw.address, 200), city: str(raw.city, 120),
    w: n(raw.w, 5000), d: n(raw.d, 5000), footprint: n(raw.footprint, 1e6), keep: n(raw.keep, 2000),
    type: TYPES[raw.type] ? raw.type : "micro", zone: str(raw.zone, 120),
    front: n(raw.front, 500), side: n(raw.side, 500), rear: n(raw.rear, 500),
    dens: n(raw.dens, 1e6) || 2000, pk: n(raw.pk, 10), code: str(raw.code, 30000),
  };
}

export function calc(i) {
  const t = TYPES[i.type];
  const lot = i.w * i.d;
  const envW = Math.max(0, i.w - 2 * i.side), envD = Math.max(0, i.d - i.front - i.rear);
  const housingLand = Math.max(0, envW * envD - i.footprint - i.keep * STALL);
  const byDensity = Math.floor(lot / i.dens);
  const byLand = Math.floor((housingLand * 0.7) / (t.fpW * t.fpD + i.pk * STALL));
  const units = Math.max(0, Math.min(byDensity, byLand));
  return { t, lot, housingLand, byDensity, byLand, units, binding: byDensity <= byLand ? "density" : "land and parking", unitParking: Math.ceil(units * i.pk) };
}
