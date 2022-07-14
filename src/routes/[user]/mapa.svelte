<script>
  import { onMount } from 'svelte';
  import { getDataUsingGeoHash } from '$lib/firebase/firestore.js';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import './mapLegends.css';


  const getColor = (type, value) => {
    const tempColor = (value) => {
      if (value > 30) return '#F3643F'
      if (value > 15) return '#F1C24A'
      else return '#28706C'
    }

    const humeColor = (value) => {
      if (value > 75) return '#F3643F'
      if (value > 40) return '#F1C24A'
      else return '#28706C'
    }

    const aireColor = (value) => {
      if (value > 2.5) return '#F3643F'
      if (value > 1.5) return '#F1C24A'
      else return '#28706C'
    }

    const audiColor = (value) => {
      if (value > 2.5) return '#F3643F'
      if (value > 1.8) return '#F1C24A'
      else return '#28706C'
    }

    const uvColor = (value) => {
      if (value > 8) return '#F3643F'
      if (value > 4) return '#F1C24A'
      else return '#28706C'
    }

    switch (type) {
      case 'temperatura':
        return tempColor(value)
      case 'humedad':
        return humeColor(value)
      case 'aire':
        return aireColor(value)
      case 'sonido':
        return audiColor(value)
      case 'uv':
        return uvColor(value)
    }

  }


  let MAP;
  let MEASURES = [];
  const CIRCLE_COLORS = {
    low: '#28706C',
    normal: '#F1C24A',
    high: '#F3643F',
  };
  const TRANSLATE_NAMES = {
    aire: 'Contaminacion atmosferica',
    humedad: 'Humedad del aire',
    temperatura: 'Temperatura',
    sonido: 'Contaminacion auditiva',
    uv: 'Radiacion UV'
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
