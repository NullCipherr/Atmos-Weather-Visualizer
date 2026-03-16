import {
  formatHour,
  formatLocalDateTime,
  formatLocationLabel,
  formatWeekday,
  getWeatherTheme,
} from "./utils.js";

function unitSymbol(unit) {
  return unit === "imperial" ? "°F" : "°C";
}

function getTemperature(unit, tempC, tempF) {
  return unit === "imperial" ? tempF : tempC;
}

function createMetricCard(label, value) {
  return `
    <div class="metric-card">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderLoading(elements) {
  elements.weatherContent.innerHTML = `
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-line" style="width: 72%"></div>
    <div class="skeleton skeleton-temp"></div>
  `;

  elements.metricsGrid.innerHTML = new Array(6)
    .fill('<div class="metric-card"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line" style="width: 60%"></div></div>')
    .join("");

  elements.hourlyList.innerHTML = new Array(8)
    .fill('<div class="hour-item"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div>')
    .join("");

  elements.dailyList.innerHTML = new Array(4)
    .fill('<div class="day-item"><div class="skeleton skeleton-line" style="width: 70%"></div><div class="skeleton skeleton-line" style="width: 35%"></div></div>')
    .join("");
}

export function renderWeather(elements, state) {
  const { weatherData, unit, favorites } = state;
  const { location, current, hourly, daily } = weatherData;

  const temp = getTemperature(unit, current.tempC, current.tempF);
  const feels = getTemperature(unit, current.feelslikeC, current.feelslikeF);
  const speed = unit === "imperial" ? `${current.windMph.toFixed(1)} mph` : `${current.windKph.toFixed(1)} km/h`;
  const pressure = unit === "imperial" ? `${current.pressureIn.toFixed(2)} in` : `${current.pressureMb.toFixed(0)} hPa`;
  const visibility = unit === "imperial" ? `${current.visibilityMiles.toFixed(1)} mi` : `${current.visibilityKm.toFixed(1)} km`;

  elements.weatherContent.innerHTML = `
    <div class="current-top">
      <div class="current-location">
        <p class="location-name">${escapeHtml(location.name)}</p>
        <p class="location-meta">${escapeHtml(formatLocationLabel(location))} • ${escapeHtml(formatLocalDateTime(location.localtimeEpoch))}</p>
      </div>
      <img class="current-icon" src="${current.icon}" alt="${escapeHtml(current.conditionText)}" />
    </div>

    <div class="current-temp-row">
      <p class="current-temp">${Math.round(temp)}${unitSymbol(unit)}</p>
      <p class="current-condition">${escapeHtml(current.conditionText)}</p>
    </div>
  `;

  elements.metricsGrid.innerHTML = [
    createMetricCard("Sensação", `${Math.round(feels)}${unitSymbol(unit)}`),
    createMetricCard("Umidade", `${current.humidity}%`),
    createMetricCard("Vento", speed),
    createMetricCard("Pressão", pressure),
    createMetricCard("Visibilidade", visibility),
    createMetricCard("Índice UV", `${current.uv}`),
  ].join("");

  elements.hourlyList.innerHTML = hourly
    .map(
      (hour) => `
      <article class="hour-item" aria-label="${escapeHtml(formatHour(hour.timeEpoch))} ${escapeHtml(hour.conditionText)}">
        <p class="hour-time">${formatHour(hour.timeEpoch)}</p>
        <img class="hour-icon" src="${hour.icon}" alt="${escapeHtml(hour.conditionText)}" />
        <p class="hour-temp">${Math.round(getTemperature(unit, hour.tempC, hour.tempF))}${unitSymbol(unit)}</p>
      </article>
    `,
    )
    .join("");

  elements.dailyList.innerHTML = daily
    .map(
      (day) => `
      <article class="day-item" aria-label="${escapeHtml(day.conditionText)}">
        <div class="day-main">
          <img class="day-icon" src="${day.icon}" alt="${escapeHtml(day.conditionText)}" />
          <div>
            <p class="day-date">${formatWeekday(day.date)}</p>
            <p class="day-cond">${escapeHtml(day.conditionText)}</p>
          </div>
        </div>
        <p class="day-range">${Math.round(getTemperature(unit, day.maxC, day.maxF))}${unitSymbol(unit)}</p>
        <p class="day-range secondary">${Math.round(getTemperature(unit, day.minC, day.minF))}${unitSymbol(unit)}</p>
      </article>
    `,
    )
    .join("");

  const isFavorite = favorites.some((city) => city.toLowerCase() === location.name.toLowerCase());
  elements.favoriteBtn.setAttribute("aria-pressed", String(isFavorite));
  elements.favoriteIcon.textContent = isFavorite ? "★" : "☆";

  const themeClass = getWeatherTheme(current.conditionCode, location.isDay);
  document.body.className = themeClass;
}

export function renderTags(container, items, emptyMessage, options = {}) {
  if (!items.length) {
    container.innerHTML = `<p class="placeholder">${emptyMessage}</p>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      if (options.withRemoveAction) {
        return `<button class="tag" type="button" data-city="${escapeHtml(item)}" data-action="open">${escapeHtml(item)}<span class="remove" data-city="${escapeHtml(item)}" data-action="remove" aria-hidden="true">×</span></button>`;
      }
      return `<button class="tag" type="button" data-city="${escapeHtml(item)}">${escapeHtml(item)}</button>`;
    })
    .join("");
}

export function setStatus(elements, message, type = "info") {
  if (!message) {
    elements.statusMessage.className = "status-message is-hidden";
    elements.statusMessage.textContent = "";
    return;
  }

  elements.statusMessage.className = `status-message ${type}`;
  elements.statusMessage.textContent = message;
}

export function renderError(elements, message) {
  elements.weatherContent.innerHTML = `
    <div>
      <h3>Não conseguimos carregar o clima agora.</h3>
      <p class="placeholder">${message}</p>
      <div class="retry-wrap">
        <button class="btn btn-primary" type="button" id="retry-btn">Tentar novamente</button>
      </div>
    </div>
  `;

  elements.metricsGrid.innerHTML = '<p class="placeholder">Sem dados para exibir.</p>';
  elements.hourlyList.innerHTML = '<p class="placeholder">Sem previsão horária.</p>';
  elements.dailyList.innerHTML = '<p class="placeholder">Sem previsão diária.</p>';
}

export function updateUnitLabel(elements, unit) {
  elements.unitToggle.textContent = `Unidade: ${unit === "imperial" ? "°F" : "°C"}`;
}
