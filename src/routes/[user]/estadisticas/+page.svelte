<script lang="ts">
  import { getUserData, saveUserData, getUserCities, saveGlobalData } from '$lib/firebase/firestore';
  import { averageData, convertRawData, createNewMeassure } from '$lib/controlData/controlData';
  import { connectToMicrobit, sendMessageToMicrobit } from '$lib/controlData/microbitController';
  import { createRandomValues } from '$lib/controlData/createRandomData';
  import { getUserCity } from '$lib/firebase/services';
  import { onMount } from 'svelte';
  import Card from '$lib/Card.svelte';
  import Section from '$lib/Section.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import ButtonAction from '$lib/ButtonAction.svelte';
  import CitiesSlider from '$lib/CitiesSlider.svelte';
  import { UserInfo } from '$lib/stores/userStores';
  import type { Meassure, MeassurePack } from '$lib/types/meassureType';
  import type { Timestamp } from 'firebase/firestore';
  import { BluetoothStore } from '$lib/stores/bluetoothStore';
  import { variables } from '$lib/variables';



  let getLastMeasurementPromise: Promise<{ success: boolean, data?: MeassurePack[] }> = Promise.resolve({ success: true });
  let getCitiesPromise: Promise<{ success: boolean, cities?: { cityName: string, country: string, update: Timestamp }[] }> = Promise.resolve({ success: true });
  let getHistoryMeasurementsPromise: Promise<{ success: boolean, meassures: Meassure[] }> = Promise.resolve({ success: true, meassures: [] });


  
  // Controla la actualizacion del historico de mediciones
  const handleHistoryClick = () => {
    let uid = $UserInfo.user?.uid!;

    getHistoryMeasurementsPromise = new Promise(async (res, rej) => {
      let { city } = await getUserCity();
      let { success, data } = await getUserData(uid, city, 5);

      if (!success) res({ success: false, meassures: [] });
      
      let values = data!.map((pack) => pack.meassures);
      let meassures = averageData(values);

      res({ success: true, meassures });
    });
  };

  // Controla el boton para tomar una nueva medida, enviando un mensaje al microbit
  const handleNewMeasureClick = async () => {
    // Segun el modo de funcionamiento, crear una medida aleatoria o enviar un mensaje al microbit
    if (variables.MODE_MICROBIT === 'bluetooth') {
      if ($BluetoothStore != null) 
        sendMessageToMicrobit('read\n');
      else {
        let state = await connectToMicrobit(handleMessageFromMicrobit);
        
        if (state) sendMessageToMicrobit('read\n');
        else alert('No se pudo conectar con el microbit');
      }

    } else {
      saveNewMessure();
    }
  };

  // Controla el mensaje que llega del microbit
  let newRawData: string[] = [];

  // Controlador de los datos enviados por la microbit
  const handleMessageFromMicrobit = async (event: any) => {
    let receivedData = [];
    for (var i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    let receivedString = String.fromCharCode.apply(null, receivedData).replace(/(\r\n|\n|\r)/gm, '');

    if (receivedString == 'init')
      newRawData = [];
    if (receivedString == 'end')      
      saveNewMessure(newRawData);
    else
      newRawData.push(receivedString);
  };

  // Guarda una nueva medida en la base de datos
  const saveNewMessure = (rawData?: string[]) => {
    getLastMeasurementPromise = new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let uid = $UserInfo.user?.uid!;
        let { latitude, longitude } = position.coords;

        let { city, country } = await getUserCity();


        // Segun el modo de funcionamiento, se crea una nueva medida
        let values: Meassure[] = [];
        if (variables.MODE_MICROBIT === 'bluetooth') {
          values = convertRawData(rawData!); // Usando los datos del microbit
        } else {
          values = createRandomValues();
        }
        

        let newMeasure = createNewMeassure(values, city, country, latitude, longitude);

        let { success: saveUserSuccess } = await saveUserData(uid, city, newMeasure);
        let { success: saveGlobSuccess } = await saveGlobalData(newMeasure);

        if (!saveGlobSuccess) alert('Error al guardar los datos globales');
        
        if (saveUserSuccess) res({ success: true, data: [newMeasure] });
        else res({ success: false });
      });
    });
  }

  onMount(async () => {
    let { city } = await getUserCity();

    getLastMeasurementPromise = getUserData($UserInfo.user?.uid!, city);
    getCitiesPromise = getUserCities($UserInfo.user?.uid!);
  });
</script>

<svelte:head>
  <title>SISTEAM: Estadisticas</title>
</svelte:head>

<Section title="Ultima medición">
  <Card>
    {#await getLastMeasurementPromise}
      <p>Cargando...</p>
    {:then { success, data }}
      {#if success}
        {#if data && data.length > 0}
          <DataTable data={data[0].meassures} />
        {:else}
          <p>Parece que no hay mediciones almacenadas...</p>
        {/if}
      {:else}
        <p>Error al cargar la ultima medición</p>
      {/if}
    {/await}
  </Card>

  <Card>
    {#await getLastMeasurementPromise}
      <p>Cargando...</p>
    {:then { success, data }}
      {#if success}
        {#if data && data.length > 0}
          <p>Ultima medicion realizada el {data[0].createdAt.toDate().toLocaleString()}</p>
        {:else}
          <p>No hay mediciones almacenadas</p>
        {/if}
      {:else}
        <p>No se pudo obtener los datos</p>
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
    {:then { success, meassures }}
      {#if success && meassures.length > 0}
        <DataTable data={meassures} />
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
    {:then { cities }}
      {#if cities}
        {#each cities as { cityName, country, update }}
          <CitiesSlider {cityName} {country} {update} />
        {/each}
      {/if}
    {:catch { err }}
      <p>Error al cargar las ciudades</p>
    {/await}
  </Card> 
</Section>
