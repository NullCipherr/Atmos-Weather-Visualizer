import { fetchWeatherByQuery } from "./api.js";
import {
  addHistory,
  getFavorites,
  getHistory,
  getUnit,
  isFavorite,
  setUnit,
  toggleFavorite,
  removeFavorite,
} from "./storage.js";
import { normalizeCityName, toTitleCase } from "./utils.js";
import {
  renderError,
  renderLoading,
  renderTags,
  renderWeather,
  setStatus,
  updateUnitLabel,
} from "./ui.js";

export class WeatherController {
  constructor({ elements, config }) {
    this.elements = elements;
    this.config = config;
    this.state = {
      unit: getUnit(),
      history: getHistory(),
      favorites: getFavorites(),
      weatherData: null,
      currentQuery: "",
      lastRequestedQuery: "",
      cache: new Map(),
    };
  }

  initializeStaticUI() {
    updateUnitLabel(this.elements, this.state.unit);
    renderTags(this.elements.historyList, this.state.history, "Sem buscas recentes.");
    renderTags(this.elements.favoritesList, this.state.favorites, "Sem favoritos ainda.", {
      withRemoveAction: true,
    });
  }

  async loadInitialWeather() {
    renderLoading(this.elements);
    setStatus(this.elements, "Obtendo sua localização...", "info");

    try {
      const coords = await this.getCurrentPosition();
      const query = `${coords.latitude},${coords.longitude}`;
      await this.searchWeather(query, {
        persistHistory: false,
        silentSuccess: true,
      });
      setStatus(this.elements, "Clima da sua localização carregado.", "success");
      return;
    } catch {
      setStatus(this.elements, "Sem permissão de localização. Mostrando cidade padrão.", "info");
    }

    await this.searchWeather(this.config.DEFAULT_CITY, {
      persistHistory: false,
      silentSuccess: true,
    });
  }

  async searchWeather(query, options = {}) {
    const { persistHistory = true, silentSuccess = false } = options;
    const normalizedQuery = normalizeCityName(query);

    if (!normalizedQuery) {
      setStatus(this.elements, "Digite uma cidade para pesquisar.", "error");
      return;
    }

    this.state.lastRequestedQuery = normalizedQuery;
    renderLoading(this.elements);
    setStatus(this.elements, "Buscando clima atualizado...", "info");

    try {
      const weatherData = await this.loadWeatherData(normalizedQuery);
      this.state.weatherData = weatherData;
      this.state.currentQuery = weatherData.location.name;

      if (persistHistory) {
        this.state.history = addHistory(weatherData.location.name);
        renderTags(this.elements.historyList, this.state.history, "Sem buscas recentes.");
      }

      renderWeather(this.elements, this.state);
      this.syncFavoriteButton();

      if (!silentSuccess) {
        setStatus(this.elements, `Clima atualizado para ${weatherData.location.name}.`, "success");
      }
    } catch (error) {
      renderError(this.elements, error.message);
      setStatus(this.elements, error.message, "error");
      this.bindRetry();
    }
  }

  toggleUnit() {
    this.state.unit = this.state.unit === "metric" ? "imperial" : "metric";
    setUnit(this.state.unit);
    updateUnitLabel(this.elements, this.state.unit);

    if (this.state.weatherData) {
      renderWeather(this.elements, this.state);
      this.syncFavoriteButton();
    }
  }

  toggleCurrentFavorite() {
    if (!this.state.weatherData) return;

    const city = this.state.weatherData.location.name;
    this.state.favorites = toggleFavorite(city);

    renderTags(this.elements.favoritesList, this.state.favorites, "Sem favoritos ainda.", {
      withRemoveAction: true,
    });

    this.syncFavoriteButton();
    setStatus(
      this.elements,
      isFavorite(city) ? `${city} adicionado aos favoritos.` : `${city} removido dos favoritos.`,
      "success",
    );
  }

  removeFavorite(city) {
    this.state.favorites = removeFavorite(city);
    renderTags(this.elements.favoritesList, this.state.favorites, "Sem favoritos ainda.", {
      withRemoveAction: true,
    });

    this.syncFavoriteButton();
  }

  async loadWeatherData(query) {
    const key = query.toLowerCase();
    const cached = this.state.cache.get(key);

    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data;
    }

    const data = await fetchWeatherByQuery({
      apiKey: this.config.WEATHER_API_KEY,
      query,
      forecastDays: this.config.FORECAST_DAYS,
      timeoutMs: this.config.REQUEST_TIMEOUT_MS,
    });

    this.state.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  syncFavoriteButton() {
    const city = this.state.weatherData?.location?.name;
    if (!city) return;

    const favorite = isFavorite(city);
    this.elements.favoriteBtn.setAttribute("aria-pressed", String(favorite));
    this.elements.favoriteIcon.textContent = favorite ? "★" : "☆";
  }

  bindRetry() {
    const retryButton = document.getElementById("retry-btn");
    if (!retryButton) return;

    retryButton.addEventListener("click", () => {
      this.searchWeather(this.state.lastRequestedQuery || this.config.DEFAULT_CITY, {
        persistHistory: false,
      });
    });
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização indisponível"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject(new Error("Permissão de localização negada")),
        {
          timeout: 9000,
          enableHighAccuracy: false,
          maximumAge: 300000,
        },
      );
    });
  }

  handleTagClick(event, source) {
    const button = event.target.closest("button[data-city]");
    if (!button) return;

    const city = button.dataset.city;

    if (source === "favorites" && event.target.dataset.action === "remove") {
      this.removeFavorite(city);
      event.stopPropagation();
      return;
    }

    this.searchWeather(toTitleCase(city));
  }
}
