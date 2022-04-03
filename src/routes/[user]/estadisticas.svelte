<script>
  import Card from '$lib/Card.svelte';
  import Section from '$lib/Section.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import ButtonAction from '$lib/ButtonAction.svelte';
  import { getUserData, saveUserData } from '$lib/firebase/firestore.js';
  import { averageData, convertRawData, createNewMeassure } from '$lib/controlData/convertData.js';
  import { connectToMicrobit, sendMessageToMicrobit } from '$lib/controlData/microbitController.js';
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';
  import '$lib/firebase/firebase.js';

  let getLastMeasurementPromise = Promise.resolve({ data: null });
  let getHistoryMeasurementsPromise = Promise.resolve({ data: null });
  let newRawData = [];



  const handleHistoryClick = () => {
    let user = getAuth().currentUser;
    getHistoryMeasurementsPromise = new Promise(async (res, rej) => {
      let r = await getUserData({ uid: user.uid, city: 'prueba', count: 5 }).catch(
        (err) => rej({ err })
      );

      let values = r.data.map((d) => d.data);

      res({ data: averageData(values) });
    });
  };


  const handleNewMeasureClick = async () => {
    let state = await connectToMicrobit(handleMessageFromMicrobit);
    
    if (state)
      sendMessageToMicrobit('read\n');
    else
      alert('No se pudo conectar con el microbit');
  };


  const handleMessageFromMicrobit = async (event) => {
    let receivedData = [];
    for (var i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    let receivedString = String.fromCharCode.apply(null, receivedData).replace(/(\r\n|\n|\r)/gm, "");

    if(receivedString == 'init') {
      newRawData = [];
    } else if (receivedString == 'final') {
      let values = await convertRawData(newRawData);

      getLastMeasurementPromise = new Promise(async (res, rej) => {
        let newMeasure = await createNewMeassure(values).catch((err) => rej({ err }));

        let userUid = getAuth().currentUser.uid;
        await saveUserData({ uid: userUid, city: 'prueba', data: newMeasure }).catch((err) => rej({ err }));

        res({ data: [ newMeasure ] });
      });

    } else {
      newRawData.push(receivedString);
    }
  };


  onMount(async () => {
    let user = getAuth().currentUser;
    getLastMeasurementPromise = getUserData({ uid: user.uid, city: 'prueba' });
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
      {#if data.lenght > 0 }
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
      {#if data}
        <DataTable {data} />
      {:else}
        <p>Parece que no hay mediciones almacenadas...</p>
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

<style>
</style>
