<script lang="ts">
  import type { MeassurePack } from '$lib/types/meassureType';
  import * as leaf from 'leaflet';
  import { onMount } from 'svelte';
  import { getDataUsingGeoHash } from '$lib/firebase/firestore';
  import { variables } from '$lib/variables';
  import { createCircle, createLevelLayer } from './createLeafletElements';
  import 'leaflet/dist/leaflet.css';
  import './mapLegends.css';

  let MAP: leaf.Map;
  let MEASURES: MeassurePack[] = [];


  const createMap = (latOr: number, longOr: number) => {
    let newMap = leaf.map('map');
    newMap.setView([latOr, longOr], 17);

    leaf.tileLayer(
      'https://{s}-tiles.locationiq.com/v3/light/r/{z}/{x}/{y}.png?key={accessToken}',
      {
        attribution: '<a href="https://locationiq.com/?ref=maps" target="_blank">© LocationIQ</a> <a href="https://openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
        accessToken: variables.API_LOCATIONIQ,
        maxZoom: 18,
        id: 'streets',
      }
    ).addTo(newMap);

    return newMap;
  };

  const centerMap = (latOr: number, longOr: number) => {
    MAP.setView([latOr, longOr], 17);

    let marker = leaf.marker([latOr, longOr]).addTo(MAP);
    marker.bindPopup(`<b>Te encuentras aqui 😎</b>`).openPopup();
  };

  onMount(async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let latOr = position.coords.latitude;
      let longOr = position.coords.longitude;

      let newMap = createMap(latOr, longOr);
      MAP = newMap;

      centerMap(latOr, longOr);

      let firebaseResponse = await getDataUsingGeoHash(latOr, longOr, 20);
      MEASURES = firebaseResponse.data ?? [];

      rederLayersOnMap();
    });
  });

  const rederLayersOnMap = () => {
    let temperatureLayerGroup: leaf.Circle[] = [];
    let humidityLayerGroup: leaf.Circle[] = [];
    let aireLayerGroup: leaf.Circle[] = [];
    let sonidoLayerGroup: leaf.Circle[] = [];
    let uvLayerGroup: leaf.Circle[] = [];

    MEASURES.forEach(({ meassures, geo, createdAt }) => {
      meassures.forEach((meassure) => {
        let circle = createCircle(meassure, geo.lat, geo.lng, createdAt);

        switch (meassure.name) {
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

    leaf.control.layers({
      'Temperatura': leaf.layerGroup(temperatureLayerGroup),
      'Humedad': leaf.layerGroup(humidityLayerGroup),
      'Contaminacion atmosferica': leaf.layerGroup(aireLayerGroup),
      'Contaminacion auditiva': leaf.layerGroup(sonidoLayerGroup),
      'Radiacion UV': leaf.layerGroup(uvLayerGroup),
    }).addTo(MAP);

    addLegendsToMap();
  };

  const addLegendsToMap = () => {
    let legend = new leaf.Control({ position: 'bottomright' });

    legend.onAdd = () => {
      let div = leaf.DomUtil.create('div', 'info legend');
      div.innerHTML += `
        <h4>Elige que valores deseas visualizar!</h4>
        <p>Esto desde el boton de capas que se encuentra en la parte superior derecha del mapa. ☝</p>
      `;
      return div;
    };

    legend.addTo(MAP);

    MAP.on('baselayerchange', ({ name }) => {
      MAP.removeControl(legend);

      legend = new leaf.Control({ position: 'bottomright' });
      legend.onAdd = () => {
        let div = leaf.DomUtil.create('div', 'info legend');

        switch (name) {
          case 'Temperatura':
            div.innerHTML += `<h4>Niveles de temperatura</h4>${createLevelLayer('temperatura')}`;
            break;
          case 'Humedad':
            div.innerHTML += `<h4>Niveles de humedad</h4>${createLevelLayer('humedad')}`;
            break;
          case 'Radiacion UV':
            div.innerHTML += `<h4>Niveles de Radiacion UV</h4>${createLevelLayer('uv')}`;
            break;
          case 'Contaminacion atmosferica':
            div.innerHTML += `<h4>Niveles de contaminacion atmosferica</h4>${createLevelLayer('aire')}`;
            break;
          case 'Contaminacion auditiva':
            div.innerHTML += `<h4>Niveles de contaminacion auditiva</h4>${createLevelLayer('sonido')}`;
            break;
        }

        return div;
      };

      legend.addTo(MAP);
    });
  };
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
