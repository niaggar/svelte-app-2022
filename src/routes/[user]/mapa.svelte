<script>
  import { onMount } from 'svelte';
  import { getDataUsingGeoHash } from '$lib/firebase/firestore.js';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import './mapLegends.css';

  let MAP;
  let MEASURES = [];
  const CIRCLE_COLORS = {
    low: '#28706C',
    normal: '#F1C24A',
    high: '#F3643F',
  };
  const TRANSLATE_NAMES = {
    pressure: 'Presión',
    humidity: 'Humedad',
    temperature: 'Temperatura',
  }

  const createMap = () => {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let latOr = position.coords.latitude;
          let longOr = position.coords.longitude;

          MAP = L.map('map');
          MAP.setView([latOr, longOr], 17);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(MAP);

          let marker = L.marker([latOr, longOr]).addTo(MAP);
          marker.bindPopup(`<b>Tu estas aqui 😎</b>`).openPopup();

          res();
        },
        (err) => rej(err)
      );
    });
  };

  onMount(async () => {
    const promises = [getDataUsingGeoHash({ count: 30 }), createMap()];
    const [{ success, data }] = await Promise.all(promises);

    if (success) {
      MEASURES = data;
      render();
    }
  });

  const render = () => {
    let temperatureLayerGroup = [];
    let humidityLayerGroup = [];
    let pressureLayerGroup = [];

    MEASURES.forEach(({ data, geo, createdAt }) => {
      const position = [geo.lat, geo.lng];

      data.forEach(({ level, type, unit, value }) => {
        let circle = L.circle(position, {
          color: CIRCLE_COLORS[level],
          fillColor: CIRCLE_COLORS[level],
          fillOpacity: 0.5,
          radius: 100,
        }).bindPopup(`
          <div class="map-legend">
            <div class="map-legend-title">
              <h3>Medicion de ${TRANSLATE_NAMES[type]}</h3>
            </div>
            <div class="map-legend-content">
              <p>El valor de esta medicion es de ${value} ${unit}.</p>
              <hr size="1px" color="#777" />
              <p class="map-legend-extra">Tomada el ${createdAt.toDate().toLocaleString()}.</p>
            </div>
          </div>
        `);

        switch (type) {
          case 'temperature':
            temperatureLayerGroup.push(circle);
            break;
          case 'humidity':
            humidityLayerGroup.push(circle);
            break;
          case 'pressure':
            pressureLayerGroup.push(circle);
            break;
        }
      });
    });

    L.control.layers({
      Temperature: L.layerGroup(temperatureLayerGroup),
      Humidity: L.layerGroup(humidityLayerGroup),
      Pressure: L.layerGroup(pressureLayerGroup),
    }).addTo(MAP);

    addLegendsToMap();
  };

  const addLegendsToMap = () => {
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += `
        <h4>Elige que valores deseas visualizar!</h4>
        <p>Esto desde el boton de capas que se encuentra en la parte superior derecha del mapa. ☝</p>
      `;
      return div;
    };

    legend.addTo(MAP);
    
    MAP.on('baselayerchange', ({ name }) => {
      MAP.removeControl(legend);

      legend = L.control({ position: 'bottomright' });
      legend.onAdd = () => {
        let div = L.DomUtil.create('div', 'info legend');

        switch (name) {
          case 'Temperature':
            div.innerHTML += `
              <h4>Niveles de temperatura</h4>
              <div>
                <span>Baja (0 - 20 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (20 - 30 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 30 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>
            `;
            break;
          case 'Humidity':
            div.innerHTML += `
              <h4>Niveles de humedad</h4>
              <div>
                <span>Baja (0 - 50%)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (50 - 70%)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 70%)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>
            `;
            break;
          case 'Pressure':
            div.innerHTML += `
              <h4>Niveles de presion</h4>
              <div>
                <span>Baja (0 - 1000 hPa)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (1000 - 1200 hPa)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 1200 hPa)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>              
            `;
            break;
        }
        return div;
      };

      legend.addTo(MAP);
    });
  }
</script>

<div id="map" />

<style>
  #map {
    height: calc(100vh - 100px);
    width: 100vw;
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
