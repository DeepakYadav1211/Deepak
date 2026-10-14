export interface AgriculturalWeather {
  latitude: number;
  longitude: number;
  locationName: string;
  locationNameHi: string;
  suburb?: string;
  city?: string;
  district?: string;
  stateName?: string;
  accuracy?: number;
  mapsUrl?: string;
  source?: 'openweather' | 'fallback';
  providerName?: string;
  hasOpenWeatherKey?: boolean;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  precipitationMm: number;
  windSpeedKmH: number;
  windDirection: number;
  uvIndex: number;
  weatherCode: number;
  conditionText: string;
  conditionTextHi: string;
  isDay: boolean;
  sprayAdvisory: {
    status: 'Optimal' | 'Unfavorable' | 'Caution';
    statusHi: 'अनुकूल' | 'प्रतिकूल' | 'सावधानी';
    reason: string;
    reasonHi: string;
    score: number; // 0-100
  };
  diseaseRisk: {
    level: 'Low' | 'Moderate' | 'High';
    levelHi: 'कम' | 'मध्यम' | 'उच्च';
    warning: string;
    warningHi: string;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    dayNameHi: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    weatherCode: number;
    conditionText: string;
    conditionTextHi: string;
  }>;
  timestamp: string;
  isGpsSource: boolean;
}

export interface AgriRegionPreset {
  id: string;
  name: string;
  nameHi: string;
  state: string;
  stateHi: string;
  lat: number;
  lon: number;
}

export const PRESET_AGRI_REGIONS: AgriRegionPreset[] = [
  { id: 'meerut', name: 'Meerut (Sugarcane/Wheat Belt)', nameHi: 'मेरठ (गन्ना व गेहूं क्षेत्र)', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', lat: 28.9845, lon: 77.7064 },
  { id: 'ludhiana', name: 'Ludhiana (Rice/Wheat Belt)', nameHi: 'लुधियाना (धान व गेहूं क्षेत्र)', state: 'Punjab', stateHi: 'पंजाब', lat: 30.9010, lon: 75.8573 },
  { id: 'karnal', name: 'Karnal (Basmati Rice Belt)', nameHi: 'करनाल (बासमती धान क्षेत्र)', state: 'Haryana', stateHi: 'हरियाणा', lat: 29.6857, lon: 76.9905 },
  { id: 'nashik', name: 'Nashik (Tomato/Onion Belt)', nameHi: 'नासिक (टमाटर व प्याज क्षेत्र)', state: 'Maharashtra', stateHi: 'महाराष्ट्र', lat: 19.9975, lon: 73.7898 },
  { id: 'indore', name: 'Indore (Soybean/Wheat Belt)', nameHi: 'इंदौर (सोयाबीन व गेहूं क्षेत्र)', state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', lat: 22.7196, lon: 75.8577 },
  { id: 'varanasi', name: 'Varanasi (Vegetables/Paddy)', nameHi: 'वाराणसी (सब्जियां व धान क्षेत्र)', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', lat: 25.3176, lon: 82.9739 },
  { id: 'patna', name: 'Patna (Maize/Rice Belt)', nameHi: 'पटना (मक्का व धान क्षेत्र)', state: 'Bihar', stateHi: 'बिहार', lat: 25.5941, lon: 85.1376 },
  { id: 'guntur', name: 'Guntur (Chili/Cotton Belt)', nameHi: 'गुंटूर (मिर्च व कपास क्षेत्र)', state: 'Andhra Pradesh', stateHi: 'आंध्र प्रदेश', lat: 16.3067, lon: 80.4365 },
  { id: 'kota', name: 'Kota (Mustard/Soybean Belt)', nameHi: 'कोटा (सरसों व सोयाबीन क्षेत्र)', state: 'Rajasthan', stateHi: 'राजस्थान', lat: 25.2138, lon: 75.8648 },
];

// WMO Weather interpretation table
export function interpretWmoCode(code: number): { en: string; hi: string; icon: string } {
  if (code === 0) return { en: 'Clear Sky', hi: 'साफ आसमान', icon: 'Sun' };
  if (code === 1) return { en: 'Mainly Clear', hi: 'मुख्यतः साफ मौसम', icon: 'SunMedium' };
  if (code === 2) return { en: 'Partly Cloudy', hi: 'आंशिक बादल', icon: 'CloudSun' };
  if (code === 3) return { en: 'Overcast', hi: 'घने बादल', icon: 'Cloud' };
  if (code === 45 || code === 48) return { en: 'Fog & Mist', hi: 'कोहरा व धुंध', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { en: 'Rain Showers', hi: 'बारिश', icon: 'CloudRain' };
  if (code >= 71 && code <= 75) return { en: 'Hail / Sleet', hi: 'ओले / शीत वर्षा', icon: 'CloudHail' };
  if (code >= 80 && code <= 82) return { en: 'Heavy Showers', hi: 'तेज मानसूनी बौछारें', icon: 'CloudRain' };
  if (code >= 95 && code <= 99) return { en: 'Thunderstorm', hi: 'आंधी-तूफान व गर्जना', icon: 'CloudLightning' };
  return { en: 'Fair Weather', hi: 'सामान्य मौसम', icon: 'Sun' };
}

const STORAGE_KEY = 'agroguard_gps_weather';

export interface LocationSearchResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type?: string;
}

export class WeatherService {
  /**
   * Request device GPS coordinates using Geolocation API
   * Implements a resilient 2-phase strategy:
   * 1. Try high-accuracy GPS (satellite/hardware sensor) with an 8s timeout
   * 2. If it times out or fails with POSITION_UNAVAILABLE, fall back to low-accuracy (cellular/Wi-Fi/cached fix)
   * 3. If browser permissions or GPS are blocked, gracefully fall back to IP-based network location
   */
  static async detectDeviceLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    isIpFallback?: boolean;
    ipCity?: string;
  }> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return this.detectLocationByIp();
    }

    // Helper wrapper around navigator.geolocation.getCurrentPosition
    const getPos = (enableHighAccuracy: boolean, timeoutMs: number, maxAgeMs: number) => {
      return new Promise<{ latitude: number; longitude: number; accuracy: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy),
            });
          },
          (err) => reject(err),
          {
            enableHighAccuracy,
            timeout: timeoutMs,
            maximumAge: maxAgeMs,
          }
        );
      });
    };

    // Phase 1: High accuracy GPS
    try {
      const highAcc = await getPos(true, 7000, 30000);
      return highAcc;
    } catch (err: any) {
      // If user explicitly denied permission, we should still try IP fallback so the widget does not stay broken
      if (err?.code === 1 /* PERMISSION_DENIED */) {
        console.warn('GPS permission denied. Trying IP-based location fallback...');
        try {
          return await this.detectLocationByIp();
        } catch {
          throw new Error('GPS location permission was denied. Please allow location access in your browser or search your village/city.');
        }
      }

      // Phase 2: If high accuracy timed out or was unavailable, retry with low accuracy (Wi-Fi/Cellular)
      try {
        const lowAcc = await getPos(false, 6000, 300000); // accept up to 5 min old position
        return lowAcc;
      } catch (phase2Err) {
        console.warn('Low accuracy GPS also failed, attempting IP location fallback...', phase2Err);
        // Phase 3: IP Location fallback
        try {
          return await this.detectLocationByIp();
        } catch (ipErr) {
          throw new Error('Unable to retrieve GPS signal or network location. Please search your district/village or choose a region below.');
        }
      }
    }
  }

  /**
   * Fast IP-based geolocation fallback for devices without GPS or with denied permissions
   */
  static async detectLocationByIp(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    isIpFallback: boolean;
    ipCity?: string;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          return {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 5000, // Approximate network accuracy (~5km)
            isIpFallback: true,
            ipCity: data.city || data.region,
          };
        }
      }
    } catch (e) {
      // ignore
    }

    // Secondary fallback: BigDataCloud client IP
    try {
      const bdc = await fetch('https://api.bigdatacloud.net/data/client-info');
      if (bdc.ok) {
        const d = await bdc.json();
        if (d.location?.latitude && d.location?.longitude) {
          return {
            latitude: d.location.latitude,
            longitude: d.location.longitude,
            accuracy: 10000,
            isIpFallback: true,
            ipCity: d.location.city,
          };
        }
      }
    } catch {
      // ignore
    }

    throw new Error('Network IP location service unreachable.');
  }

  /**
   * Search village, town, city, or district by text query
   */
  static async searchLocations(query: string, lang: 'en' | 'hi' = 'en'): Promise<LocationSearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      // 1. Try server proxy endpoint
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          return data.results;
        }
      }
    } catch (e) {
      console.warn('Backend /api/geocode failed, trying direct client lookup:', e);
    }

    // 2. Direct Nominatim fallback
    try {
      const clientUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5&accept-language=${lang === 'hi' ? 'hi,en' : 'en,hi'}`;
      const resp = await fetch(clientUrl, {
        headers: { 'User-Agent': 'AgroGuardAI-AgriWeather/2.0' },
      });
      if (resp.ok) {
        const items = await resp.json();
        if (Array.isArray(items)) {
          return items.map((item: any) => {
            const a = item.address || {};
            const locality =
              a.village || a.town || a.suburb || a.neighbourhood || a.city_district || a.city || a.county || '';
            const state = a.state || '';
            const parts: string[] = [];
            if (locality) parts.push(locality);
            if (state && !parts.includes(state)) parts.push(state);
            return {
              name: parts.length > 0 ? parts.join(', ') : item.display_name.split(',').slice(0, 3).join(','),
              displayName: item.display_name,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
            };
          });
        }
      }
    } catch {
      // ignore
    }

    return [];
  }

  /**
   * Reverse-geocode coordinates to get City/District and State names
   */
  static async reverseGeocode(lat: number, lon: number): Promise<{
    name: string;
    nameHi: string;
    suburb?: string;
    city?: string;
    state?: string;
  }> {
    // 1. Nominatim high precision (zoom=18 for exact suburb/locality)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const [resEn, resHi] = await Promise.all([
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&format=json&accept-language=en`,
          {
            headers: { 'User-Agent': 'AgroGuardAI-AgriWeather/2.0' },
            signal: controller.signal,
          }
        ),
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&format=json&accept-language=hi`,
          {
            headers: { 'User-Agent': 'AgroGuardAI-AgriWeather/2.0' },
            signal: controller.signal,
          }
        ),
      ]);
      clearTimeout(timeoutId);

      if (resEn.ok) {
        const dataEn = await resEn.json();
        const a = dataEn.address || {};
        const suburb = a.suburb || a.neighbourhood || a.residential || a.village || a.town || a.quarter || a.hamlet || '';
        const city = a.city || a.town || a.city_district || a.state_district || a.county || '';
        const state = a.state || '';

        const parts: string[] = [];
        if (suburb) parts.push(suburb);
        if (city && !parts.includes(city)) parts.push(city);
        if (state && !parts.includes(state)) parts.push(state);
        const locEn = parts.join(', ');

        let locHi = locEn;
        if (resHi.ok) {
          const dataHi = await resHi.json();
          const aHi = dataHi.address || {};
          const subHi = aHi.suburb || aHi.neighbourhood || aHi.residential || aHi.village || aHi.town || aHi.quarter || aHi.hamlet || '';
          const cityHi = aHi.city || aHi.town || aHi.city_district || aHi.state_district || aHi.county || '';
          const stateHi = aHi.state || '';

          const partsHi: string[] = [];
          if (subHi) partsHi.push(subHi);
          if (cityHi && !partsHi.includes(cityHi)) partsHi.push(cityHi);
          if (stateHi && !partsHi.includes(stateHi)) partsHi.push(stateHi);
          if (partsHi.length > 0) {
            locHi = partsHi.join(', ');
          }
        }

        if (locEn) {
          return {
            name: locEn,
            nameHi: locHi,
            suburb,
            city,
            state,
          };
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding network notice:', e);
    }

    // 2. BigDataCloud fallback (fast, non-rate-limited)
    try {
      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (bdcRes.ok) {
        const d = await bdcRes.json();
        const suburb = d.locality || '';
        const city = d.city || '';
        const state = d.principalSubdivision || '';

        const parts: string[] = [];
        if (suburb) parts.push(suburb);
        if (city && !parts.includes(city)) parts.push(city);
        if (state && !parts.includes(state)) parts.push(state);
        if (parts.length > 0) {
          const locEn = parts.join(', ');
          return {
            name: locEn,
            nameHi: locEn,
            suburb,
            city,
            state,
          };
        }
      }
    } catch (bdcErr) {
      // ignore
    }

    // Mathematical nearest preset region fallback for clean naming
    let closest = PRESET_AGRI_REGIONS[0];
    let minDistance = Infinity;
    for (const preset of PRESET_AGRI_REGIONS) {
      const d = Math.hypot(preset.lat - lat, preset.lon - lon);
      if (d < minDistance) {
        minDistance = d;
        closest = preset;
      }
    }
    return {
      name: `${closest.name} (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      nameHi: `${closest.nameHi} (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      state: closest.state,
    };
  }

  /**
   * Fetch live weather data for given coordinates
   * Connects to OpenWeather API proxy server-side
   */
  static async fetchWeather(
    lat: number,
    lon: number,
    isGps = false,
    customLocationName?: { en: string; hi: string },
    lang: 'en' | 'hi' = 'en',
    accuracy?: number
  ): Promise<AgriculturalWeather> {
    // 1. Prefer backend /api/weather endpoint (proxies OpenWeather API securely)
    try {
      const apiRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}&lang=${lang}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        const weatherResult: AgriculturalWeather = {
          ...data,
          locationName: customLocationName?.en || data.locationName,
          locationNameHi: customLocationName?.hi || data.locationNameHi,
          isGpsSource: isGps,
          accuracy: accuracy ?? data.accuracy,
          mapsUrl: data.mapsUrl || `https://www.google.com/maps?q=${lat},${lon}`,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherResult));
        } catch {
          // Ignore storage quota
        }
        return weatherResult;
      }
    } catch (serverErr) {
      console.warn('Backend /api/weather unavailable, using client fallback:', serverErr);
    }

    // 2. Client fallback in case backend is loading
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
    const feelsLike = Math.round((current.apparent_temperature ?? temp) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 70);
    const rainMm = current.precipitation ?? 0;
    const windSpeed = Math.round((current.wind_speed_10m ?? 8) * 10) / 10;
    const windDir = current.wind_direction_10m ?? 0;
    const weatherCode = current.weather_code ?? 0;
    const isDay = Boolean(current.is_day ?? 1);

    // Today's rain probability from daily forecast
    const todayRainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] ?? 10 : 10;

    // Get location name
    let locNameEn = customLocationName?.en;
    let locNameHi = customLocationName?.hi;

    if (!locNameEn || !locNameHi) {
      const geo = await this.reverseGeocode(lat, lon);
      locNameEn = geo.name;
      locNameHi = geo.nameHi;
    }

    // Weather condition translation
    const condition = interpretWmoCode(weatherCode);

    // 1. Calculate Pesticide Spray Window
    let sprayStatus: 'Optimal' | 'Unfavorable' | 'Caution' = 'Optimal';
    let sprayStatusHi: 'अनुकूल' | 'प्रतिकूल' | 'सावधानी' = 'अनुकूल';
    let sprayReason = 'Wind speed is low (< 15 km/h) and rain probability is low (< 20%). Ideal for drift-free foliar spray.';
    let sprayReasonHi = 'हवा की गति 15 किमी/घंटे से कम है और बारिश का अनुमान कम (< 20%) है। कीटनाशक छिड़काव के लिए यह उत्तम समय है।';
    let sprayScore = 95;

    if (windSpeed > 18) {
      sprayStatus = 'Unfavorable';
      sprayStatusHi = 'प्रतिकूल';
      sprayReason = `High wind speeds (${windSpeed} km/h). Severe pesticide drift hazard to off-target crops or pollinators. Postpone spraying.`;
      sprayReasonHi = `हवा की गति तेज (${windSpeed} किमी/घंटा) है। दवा उड़कर पास के खेतों में जाने का खतरा है। छिड़काव स्थगित करें।`;
      sprayScore = 30;
    } else if (todayRainProb > 45 || rainMm > 1) {
      sprayStatus = 'Unfavorable';
      sprayStatusHi = 'प्रतिकूल';
      sprayReason = `High rain probability (${todayRainProb}%). Fungicide and insecticide wash-off risk. Wait for dry spell.`;
      sprayReasonHi = `बारिश की उच्च संभावना (${todayRainProb}%) है। दवा बह जाने का खतरा है। मौसम साफ होने तक प्रतीक्षा करें।`;
      sprayScore = 35;
    } else if (windSpeed > 12 || todayRainProb > 25 || temp > 35) {
      sprayStatus = 'Caution';
      sprayStatusHi = 'सावधानी';
      sprayReason = `Moderate wind (${windSpeed} km/h) or warm temperature (${temp}°C). Use coarse droplet nozzles early in the morning or late evening.`;
      sprayReasonHi = `मध्यम हवा (${windSpeed} किमी/घंटा) या अधिक तापमान है। सुबह या शाम के ठंडे समय में ही सावधानी से छिड़काव करें।`;
      sprayScore = 65;
    }

    // 2. Calculate Disease Risk Index
    let diseaseLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    let diseaseLevelHi: 'कम' | 'मध्यम' | 'उच्च' = 'कम';
    let diseaseWarning = 'Current humidity and temperature levels do not present an immediate fungal spore spike.';
    let diseaseWarningHi = 'वर्तमान तापमान व नमी में फफूंद व झुलसा रोग का खतरा कम है। सामान्य निगरानी जारी रखें।';

    if (humidity >= 80 && temp >= 22 && temp <= 32) {
      diseaseLevel = 'High';
      diseaseLevelHi = 'उच्च';
      diseaseWarning = `High Humidity Alert (${humidity}%) at ${temp}°C: Optimal incubation environment for Early Blight, Downy Mildew & Rust. Scout vulnerable fields immediately.`;
      diseaseWarningHi = `उच्च नमी चेतावनी (${humidity}%) व ${temp}°C तापमान: अगेती झुलसा, डाउनी मिल्ड्यू व रतुआ फफूंद पनपने का प्रबल खतरा। अपनी फसल की तुरंत जांच करें।`;
    } else if (humidity >= 65 || todayRainProb >= 35) {
      diseaseLevel = 'Moderate';
      diseaseLevelHi = 'मध्यम';
      diseaseWarning = `Moderate moisture (${humidity}% humidity). Elevated risk for bacterial leaf spot and damping off in waterlogged zones.`;
      diseaseWarningHi = `मध्यम नमी (${humidity}%)। जलभराव वाले क्षेत्रों में जीवाणु धब्बा रोग का खतरा हो सकता है। जल निकासी सुनिश्चित करें।`;
    }

    // 3. Format 5-Day Forecast
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

    const forecastList: AgriculturalWeather['forecast'] = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const dStr = daily.time[i];
        const dateObj = new Date(dStr);
        const dayIdx = dateObj.getDay();
        const code = daily.weather_code ? daily.weather_code[i] ?? 0 : 0;
        const cond = interpretWmoCode(code);

        forecastList.push({
          date: dStr,
          dayName: i === 0 ? 'Today' : daysEn[dayIdx],
          dayNameHi: i === 0 ? 'आज' : daysHi[dayIdx],
          tempMax: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[i] ?? 30 : 30),
          tempMin: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[i] ?? 22 : 22),
          rainProb: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] ?? 0 : 0),
          weatherCode: code,
          conditionText: cond.en,
          conditionTextHi: cond.hi,
        });
      }
    }

    const weatherResult: AgriculturalWeather = {
      latitude: lat,
      longitude: lon,
      locationName: locNameEn,
      locationNameHi: locNameHi,
      temperature: temp,
      feelsLike,
      humidity,
      rainProbability: todayRainProb,
      precipitationMm: rainMm,
      windSpeedKmH: windSpeed,
      windDirection: windDir,
      uvIndex: isDay ? 6 : 0,
      weatherCode,
      conditionText: condition.en,
      conditionTextHi: condition.hi,
      isDay,
      sprayAdvisory: {
        status: sprayStatus,
        statusHi: sprayStatusHi,
        reason: sprayReason,
        reasonHi: sprayReasonHi,
        score: sprayScore,
      },
      diseaseRisk: {
        level: diseaseLevel,
        levelHi: diseaseLevelHi,
        warning: diseaseWarning,
        warningHi: diseaseWarningHi,
      },
      forecast: forecastList,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGpsSource: isGps,
    };

    // Cache locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherResult));
    } catch {
      // Ignore storage error
    }

    return weatherResult;
  }

  /**
   * Retrieve cached weather or default to Meerut preset
   */
  static getCachedWeather(): AgriculturalWeather | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return null;
  }
}
