import { fixIconUrl } from "./utils.js";

const API_BASE_URL = "https://api.weatherapi.com/v1";

function withTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function mapHourlyForecast(forecastDays, nowEpoch) {
  return forecastDays
    .flatMap((day) => day.hour)
    .filter((hour) => hour.time_epoch >= nowEpoch)
    .slice(0, 12)
    .map((hour) => ({
      timeEpoch: hour.time_epoch,
      icon: fixIconUrl(hour.condition.icon),
      conditionText: hour.condition.text,
      tempC: hour.temp_c,
      tempF: hour.temp_f,
    }));
}

function mapDailyForecast(forecastDays) {
  return forecastDays.slice(0, 5).map((day) => ({
    date: day.date,
    icon: fixIconUrl(day.day.condition.icon),
    conditionText: day.day.condition.text,
    maxC: day.day.maxtemp_c,
    maxF: day.day.maxtemp_f,
    minC: day.day.mintemp_c,
    minF: day.day.mintemp_f,
  }));
}

export async function fetchWeatherByQuery({ apiKey, query, forecastDays = 5, timeoutMs = 12000 }) {
  const endpoint = `${API_BASE_URL}/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&days=${forecastDays}&aqi=no&alerts=no&lang=pt`;

  let response;

  try {
    response = await withTimeout(endpoint, timeoutMs);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Tempo de resposta excedido. Tente novamente.");
    }
    throw new Error("Falha de conexão. Verifique sua internet e tente novamente.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Resposta inválida da API de clima.");
  }

  if (!response.ok || payload.error) {
    const errorMessage = payload?.error?.message || "Não foi possível obter o clima para essa cidade.";
    throw new Error(errorMessage);
  }

  const nowEpoch = payload.current.last_updated_epoch;

  return {
    location: {
      name: payload.location.name,
      region: payload.location.region,
      country: payload.location.country,
      localtimeEpoch: payload.location.localtime_epoch,
      isDay: payload.current.is_day === 1,
    },
    current: {
      conditionText: payload.current.condition.text,
      conditionCode: payload.current.condition.code,
      icon: fixIconUrl(payload.current.condition.icon),
      tempC: payload.current.temp_c,
      tempF: payload.current.temp_f,
      feelslikeC: payload.current.feelslike_c,
      feelslikeF: payload.current.feelslike_f,
      humidity: payload.current.humidity,
      windKph: payload.current.wind_kph,
      windMph: payload.current.wind_mph,
      pressureMb: payload.current.pressure_mb,
      pressureIn: payload.current.pressure_in,
      visibilityKm: payload.current.vis_km,
      visibilityMiles: payload.current.vis_miles,
      uv: payload.current.uv,
      lastUpdatedEpoch: payload.current.last_updated_epoch,
    },
    hourly: mapHourlyForecast(payload.forecast.forecastday, nowEpoch),
    daily: mapDailyForecast(payload.forecast.forecastday),
  };
}
