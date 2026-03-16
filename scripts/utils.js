const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short",
});
const HOUR_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function getWeatherTheme(conditionCode, isDay) {
  if (!isDay) {
    if ([1000].includes(conditionCode)) return "theme-clear-night";
    return "theme-cloudy-night";
  }

  if ([1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264].includes(conditionCode)) {
    return "theme-snow";
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return "theme-storm";
  }

  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    return "theme-rainy";
  }

  if ([1003, 1006, 1009, 1030, 1135, 1147].includes(conditionCode)) {
    return "theme-cloudy-day";
  }

  return "theme-clear-day";
}

export function fixIconUrl(iconPath) {
  return iconPath.startsWith("//") ? `https:${iconPath}` : iconPath;
}

export function formatLocationLabel(location) {
  const region = location.region ? `${location.region}, ` : "";
  return `${region}${location.country}`;
}

export function formatLocalDateTime(localtimeEpoch) {
  return DATE_TIME_FORMATTER.format(new Date(localtimeEpoch * 1000));
}

export function formatHour(timestamp) {
  return HOUR_FORMATTER.format(new Date(timestamp * 1000));
}

export function formatWeekday(dateString) {
  const raw = WEEKDAY_FORMATTER.format(new Date(dateString));
  return raw.replace(".", "").replace(/^./, (char) => char.toUpperCase());
}

export function normalizeCityName(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidApiKey(key) {
  return typeof key === "string" && key.trim().length > 10 && !key.includes("SUA_CHAVE");
}

export function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
