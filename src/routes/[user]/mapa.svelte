<script>
  import { onMount } from 'svelte';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  let map;


  function createMap(container) {
    map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  function mapAction(container) {
    createMap(container);
    return {
      destroy: () => {
        map.remove();
      },
    };
  }
</script>



<div id="map" use:mapAction />


<style>
  #map {
    height:100vh;
    width:100vw;
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
