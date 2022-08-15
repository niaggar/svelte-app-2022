<script>
  import { onMount } from 'svelte';
  import { getDataUsingGeoHash } from '$lib/firebase/firestore.js';
  import { getColor, EXTEND_NAMES, CIRCLE_COLORS } from '$lib/controlData/utilDataTypes.js';
  import { variables } from '$lib/variables';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import './mapLegends.css';

  let MAP;
  let MEASURES = [];
  

  const createMap = () => {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          let latOr = position.coords.latitude;
          let longOr = position.coords.longitude;

          MAP = L.map('map');
          MAP.setView([latOr, longOr], 17);

          L.tileLayer('https://{s}-tiles.locationiq.com/v3/light/r/{z}/{x}/{y}.png?key={accessToken}', {
            attribution: '<a href="https://locationiq.com/?ref=maps" target="_blank">© LocationIQ</a> <a href=\"https://openstreetmap.org/about/\" target=\"_blank\">© OpenStreetMap</a>',
            accessToken: variables.API_LOCATIONIQ,
            maxZoom: 18,
            id: 'streets',
          }).addTo(MAP);

          let marker = L.marker([latOr, longOr]).addTo(MAP);
          marker.bindPopup(`<b>Te encuentras aqui 😎</b>`).openPopup();

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
    let aireLayerGroup = [];
    let sonidoLayerGroup = [];
    let uvLayerGroup = [];

    MEASURES.forEach(({ data, geo, createdAt }) => {
      const position = [geo.lat, geo.lng];

      data.forEach(({ level, type, unit, value }) => {
        let circle = L.circle(position, {
          color: getColor(type, value),
          fillColor: getColor(type, value),
          fillOpacity: 0.5,
          radius: 100,
        }).bindPopup(`
          <div class="map-legend">
            <div class="map-legend-title">
              <h3>Medicion de ${EXTEND_NAMES[type]}</h3>
            </div>
            <div class="map-legend-content">
              <p>El valor de esta medicion es de ${value} ${unit}.</p>
              <hr size="1px" color="#777" />
              <p class="map-legend-extra">Tomada el ${createdAt.toDate().toLocaleString()}.</p>
            </div>
          </div>
        `);

        switch (type) {
          case 'temperatura':
            temperatureLayerGroup.push(circle);
            break;
          case 'humedad':
            humidityLayerGroup.push(circle);
            break;
          case 'aire':
            aireLayerGroup.push(circle);
            break;
          case 'sonido':
            sonidoLayerGroup.push(circle);
            break;
          case 'uv':
            uvLayerGroup.push(circle);
            break;
        }
      });
    });

    L.control.layers({
      'Temperatura': L.layerGroup(temperatureLayerGroup),
      'Humedad': L.layerGroup(humidityLayerGroup),
      'Contaminacion atmosferica': L.layerGroup(aireLayerGroup),
      'Contaminacion auditiva': L.layerGroup(sonidoLayerGroup),
      'Radiacion UV': L.layerGroup(uvLayerGroup),
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
          case 'Temperatura':
            div.innerHTML += `
              <h4>Niveles de temperatura</h4>
              <div>
                <span>Baja (-20 - 15 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (15 - 30 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 30 C)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>
            `;
            break;
          case 'Humedad':
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
          case 'Radiacion UV':
            div.innerHTML += `
              <h4>Niveles de Radiacion UV</h4>
              <div>
                <span>Baja (0 - 4 uv)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (4 - 8 uv)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 8 uv)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>              
            `;
            break;
          case 'Contaminacion atmosferica':
            div.innerHTML += `
              <h4>Niveles de contaminacion atmosferica</h4>
              <div>
                <span>Baja (0 - 1.5 V)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (1.5 - 2.5 V)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 2.5 V)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
              </div>              
            `;
            break;
          case 'Contaminacion auditiva':
            div.innerHTML += `
              <h4>Niveles de contaminacion auditiva</h4>
              <div>
                <span>Baja (0 - 1.8 V)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
              </div>
              <div>
                <span>Normal (1.8 - 2.5 V)</span>
                <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
              </div>
              <div>
                <span>Alta (> 2.5 V)</span>
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
