<script>
  import { onMount } from 'svelte';
  import { getDataUsingGeoHash } from '$lib/firebase/firestore.js';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  let map;

  const circleColors = {
    low: '#28706C',
    normal: '#F1C24A',
    high: '#F3643F',
  };

  function createMap() {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let latOr = position.coords.latitude;
        let longOr = position.coords.longitude;

        map = L.map('map');
        map.setView([latOr, longOr], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const messures = await getDataUsingGeoHash({ count: 5 });

        console.log(messures);

        messures.data.forEach(({ level, geo: { lat, lng } }) => {
          console.log(level);
          
          const circle = L.circle([lat, lng], {
            color: circleColors[level],
            fillColor: circleColors[level],
            fillOpacity: 0.5,
            radius: 400
          }).addTo(map);
        });
      });

    } catch (err) { }
  }

  function mapAction(con) {
    createMap(con);
    
    return {
      destroy: () => {
        map.remove();
      },
    };
  }

  onMount(() => {
    
  });
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
