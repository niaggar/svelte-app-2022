<script>
  import Card from '$lib/Card.svelte';
  import Section from '$lib/Section.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import ButtonAction from '$lib/ButtonAction.svelte';
  import CitiesSlider from '$lib/CitiesSlider.svelte';
  import { getUserData, saveUserData, getUserCities, saveGlobalData } from '$lib/firebase/firestore.js';
  import { averageData, convertRawData, createNewMeassure } from '$lib/controlData/convertData.js';
  import { connectToMicrobit, sendMessageToMicrobit } from '$lib/controlData/microbitController.js';
  import { variables } from '$lib/variables';
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';
  import '$lib/firebase/firebase.js';

  let getLastMeasurementPromise = Promise.resolve({ data: [] });
  let getHistoryMeasurementsPromise = Promise.resolve({ data: [] });
  let getCitiesPromise = Promise.resolve({ data: [] });
  let newRawData = [];


  // Controla la actualizacion del historico de mediciones
  const handleHistoryClick = () => {
    let user = getAuth().currentUser;
    getHistoryMeasurementsPromise = new Promise(async (res, rej) => {
      let { city } = await fetch(`https://ipinfo.io/json?token=${variables.API_IPINFO}`).then((res) => res.json());
      let r = await getUserData({ uid: user.uid, city: city, count: 5 }).catch(
        (err) => rej({ err })
      );

      let values = r.data.map((d) => d.data);

      res({ data: averageData(values) });
    });
  };

  // Controla el boton para tomar una nueva medida, enviando un mensaje al microbit
  const handleNewMeasureClick = async () => {
    let state = await connectToMicrobit(handleMessageFromMicrobit);
    
    if (state)
      sendMessageToMicrobit('read\n');
    else
      alert('No se pudo conectar con el microbit');
  };

  // Controlador de los datos enviados por la microbit
  const handleMessageFromMicrobit = async (event) => {
    let receivedData = [];
    for (var i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    let receivedString = String.fromCharCode.apply(null, receivedData).replace(/(\r\n|\n|\r)/gm, "");

    if (receivedString == 'init') {
      newRawData = [];
    } else if (receivedString == 'end') {
      getLastMeasurementPromise = new Promise(async (res, rej) => {
        let userUid = getAuth().currentUser.uid;
        let { city, country } = await fetch(`https://ipinfo.io/json?token=${variables.API_IPINFO}`).then((res) => res.json()).catch((err) => rej({ err }));

        let values = await convertRawData(newRawData);
        let newMeasure = await createNewMeassure({ city, country, data: values }).catch((err) => rej({ err }));

        await saveUserData({ uid: userUid, city: city, data: newMeasure }).catch((err) => rej({ err }));
        console.log("OKAY OKAY")
        await saveGlobalData({ data: newMeasure }).catch((err) => rej({ err }));

        res({ data: [ newMeasure ] });
      });

    } else {
      newRawData.push(receivedString);
    }
  };


  onMount(async () => {
    let user = getAuth().currentUser;

    let { city } = await fetch(`https://ipinfo.io/json?token=${variables.API_IPINFO}`).then((res) => res.json());
    getLastMeasurementPromise = getUserData({ uid: user.uid, city: city });
    getCitiesPromise = getUserCities({ uid: user.uid });
  });
</script>

<svelte:head>
  <title>SISTEAM: Estadisticas</title>
</svelte:head>

<Section title="Ultima medición">
  <Card>
    {#await getLastMeasurementPromise}
      <p>Cargando...</p>
    {:then { data }}
      {#if data.length > 0}
        <DataTable data={data[0].data} />
      {:else}
        <p>Parece que no hay mediciones almacenadas...</p>
      {/if}
    {:catch { err }}
      <p>Error al cargar la ultima medición</p>
    {/await}
  </Card>

  <Card>
    {#await getLastMeasurementPromise}
      <p>Cargando...</p>
    {:then { data }}
      {#if data.length > 0 }
        <p>
          Ultima medicion realizada el {data[0].createdAt
            .toDate()
            .toLocaleString()}
        </p>
      {:else}
        <p>No hay mediciones almacenadas</p>
      {/if}
    {/await}

    <ButtonAction
      action={handleNewMeasureClick}
      visibleText="Realizar medición ahora"
      type="yellow"
    />
  </Card>
</Section>

<Section title="Historico de mediciones">
  <Card>
    {#await getHistoryMeasurementsPromise}
      <p>Cargando...</p>
    {:then { data }}
      {#if data.length > 0}
        <DataTable {data} />
      {:else}
        <p>Actualiza el historico...</p>
      {/if}
    {:catch { err }}
      <p>Error al cargar el historico de mediciones</p>
    {/await}
  </Card>

  <ButtonAction
    action={handleHistoryClick}
    visibleText="Actualizar historico de mediciones"
    type="white"
  />
</Section>


<Section title="Ciudades">
  <Card>
    <p>A continuacion se listan las ciudades en donde has tomado mediciones.</p>

    {#await getCitiesPromise}
      <p>Cargando...</p>
    {:then { data }}
      {#each data as { cityName, country, update }}
        <CitiesSlider {cityName} {country} {update}/>
      {/each}
    {:catch { err }}
      <p>Error al cargar las ciudades</p>
    {/await}
  </Card>
</Section>

<style>
</style>
