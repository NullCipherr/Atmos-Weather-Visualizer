const KEYS = {
  HISTORY: "atmos:history",
  FAVORITES: "atmos:favorites",
  UNIT: "atmos:unit",
  API_KEY: "atmos:api-key",
};

const LIMITS = {
  HISTORY: 8,
  FAVORITES: 8,
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : parsed;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUnit() {
  const unit = localStorage.getItem(KEYS.UNIT);
  return unit === "imperial" ? "imperial" : "metric";
}

export function setUnit(unit) {
  localStorage.setItem(KEYS.UNIT, unit);
}

export function getHistory() {
  return readJSON(KEYS.HISTORY, []);
}

export function addHistory(city) {
  const current = getHistory();
  const normalized = city.trim();
  const unique = [normalized, ...current.filter((item) => item.toLowerCase() !== normalized.toLowerCase())];
  writeJSON(KEYS.HISTORY, unique.slice(0, LIMITS.HISTORY));
  return getHistory();
}

export function getFavorites() {
  return readJSON(KEYS.FAVORITES, []);
}

export function toggleFavorite(city) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.toLowerCase() === city.toLowerCase());
  const updated = exists
    ? favorites.filter((item) => item.toLowerCase() !== city.toLowerCase())
    : [city, ...favorites].slice(0, LIMITS.FAVORITES);

  writeJSON(KEYS.FAVORITES, updated);
  return updated;
}

export function removeFavorite(city) {
  const favorites = getFavorites().filter((item) => item.toLowerCase() !== city.toLowerCase());
  writeJSON(KEYS.FAVORITES, favorites);
  return favorites;
}

export function isFavorite(city) {
  return getFavorites().some((item) => item.toLowerCase() === city.toLowerCase());
}

export function getStoredApiKey() {
  return localStorage.getItem(KEYS.API_KEY) || "";
}

export function setStoredApiKey(value) {
  localStorage.setItem(KEYS.API_KEY, value.trim());
}

export function clearStoredApiKey() {
  localStorage.removeItem(KEYS.API_KEY);
}
