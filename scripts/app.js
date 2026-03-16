import { WeatherController } from "./weather.js";
import { isValidApiKey } from "./utils.js";
import { setStatus } from "./ui.js";
import { clearStoredApiKey, getStoredApiKey, setStoredApiKey } from "./storage.js";

const APP_CONFIG = {
  WEATHER_API_KEY: "",
  DEFAULT_CITY: "Sao Paulo",
  FORECAST_DAYS: 5,
  REQUEST_TIMEOUT_MS: 12000,
};

const elements = {
  searchForm: document.getElementById("search-form"),
  cityInput: document.getElementById("city-input"),
  locationBtn: document.getElementById("location-btn"),
  unitToggle: document.getElementById("unit-toggle"),
  favoriteBtn: document.getElementById("favorite-btn"),
  favoriteIcon: document.getElementById("favorite-icon"),
  weatherContent: document.getElementById("weather-content"),
  metricsGrid: document.getElementById("metrics-grid"),
  hourlyList: document.getElementById("hourly-list"),
  dailyList: document.getElementById("daily-list"),
  historyList: document.getElementById("history-list"),
  favoritesList: document.getElementById("favorites-list"),
  statusMessage: document.getElementById("status-message"),
  apiSettingsToggle: document.getElementById("api-settings-toggle"),
  apiSettingsPanel: document.getElementById("api-settings-panel"),
  apiKeyForm: document.getElementById("api-key-form"),
  apiKeyInput: document.getElementById("api-key-input"),
  clearApiKeyBtn: document.getElementById("clear-api-key-btn"),
};

const controller = new WeatherController({
  elements,
  config: APP_CONFIG,
});

controller.initializeStaticUI();

function resolveApiKey() {
  const storedKey = getStoredApiKey();
  return isValidApiKey(storedKey) ? storedKey : "";
}

function syncApiKeyUI() {
  const storedKey = getStoredApiKey();
  elements.apiKeyInput.value = storedKey;
}

function toggleApiPanel(forceOpen = null) {
  const willOpen = typeof forceOpen === "boolean"
    ? forceOpen
    : elements.apiSettingsPanel.classList.contains("is-hidden");

  elements.apiSettingsPanel.classList.toggle("is-hidden", !willOpen);
  elements.apiSettingsToggle.setAttribute("aria-expanded", String(willOpen));
}

controller.config.WEATHER_API_KEY = resolveApiKey();
syncApiKeyUI();

if (!isValidApiKey(controller.config.WEATHER_API_KEY)) {
  setStatus(
    elements,
    "Cole sua chave em 'Configurar API' para habilitar o clima.",
    "error",
  );
  toggleApiPanel(true);
} else {
  controller.loadInitialWeather();
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controller.searchWeather(elements.cityInput.value);
});

elements.locationBtn.addEventListener("click", async () => {
  const coords = await controller.getCurrentPosition().catch(() => null);
  if (!coords) {
    setStatus(elements, "Não foi possível acessar sua localização no momento.", "error");
    return;
  }

  controller.searchWeather(`${coords.latitude},${coords.longitude}`, {
    persistHistory: false,
  });
});

elements.unitToggle.addEventListener("click", () => {
  controller.toggleUnit();
});

elements.favoriteBtn.addEventListener("click", () => {
  controller.toggleCurrentFavorite();
});

elements.historyList.addEventListener("click", (event) => {
  controller.handleTagClick(event, "history");
});

elements.favoritesList.addEventListener("click", (event) => {
  controller.handleTagClick(event, "favorites");
});

elements.apiSettingsToggle.addEventListener("click", () => {
  toggleApiPanel();
});

elements.apiKeyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const rawKey = elements.apiKeyInput.value.trim();

  if (!isValidApiKey(rawKey)) {
    setStatus(elements, "A chave informada parece inválida. Verifique e tente novamente.", "error");
    return;
  }

  setStoredApiKey(rawKey);
  controller.config.WEATHER_API_KEY = rawKey;
  setStatus(elements, "Chave salva com sucesso.", "success");
  toggleApiPanel(false);

  if (!controller.state.weatherData) {
    await controller.loadInitialWeather();
    return;
  }

  controller.searchWeather(controller.state.currentQuery || APP_CONFIG.DEFAULT_CITY, {
    persistHistory: false,
  });
});

elements.clearApiKeyBtn.addEventListener("click", () => {
  clearStoredApiKey();
  controller.config.WEATHER_API_KEY = "";
  elements.apiKeyInput.value = "";
  setStatus(elements, "Chave removida. Configure uma nova chave para continuar.", "error");
  toggleApiPanel(true);
});
