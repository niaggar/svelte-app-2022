<script>
  import Card from '$lib/Card.svelte';
  import Section from '$lib/Section.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import ButtonLink from '$lib/ButtonLink.svelte';
  import ButtonAction from '$lib/ButtonAction.svelte';
  import { getUserData } from '$lib/firebase/firestore.js';
  import { variables } from '$lib/variables';
  import { getAuth } from 'firebase/auth';
  import { onMount } from 'svelte';
  import '$lib/firebase/firebase.js';


  let getLastMeasurementPromise = Promise.resolve({ data: [] });
  let userRouteToDoNewMeasurement = '';
  let seeTutorial = false;

  onMount(async () => {
    let user =  getAuth().currentUser;

    userRouteToDoNewMeasurement = `/${user.displayName.replace(/\s+/g, '').toLowerCase()}/estadisticas`;
    let { city } = await fetch(`https://ipinfo.io/json?token=${variables.API_IPINFO}`).then((res) => res.json());
    getLastMeasurementPromise = getUserData({ uid: user.uid, city });
  });
</script>


<Section title="Bienvenida">
  <Card>
    <h2><i style="color: #28706C;">EcoBox</i> te da la bienvenida</h2>
    <p>
      Para comenzar a utilizar la aplicacion te recomendamos que leas el siguiente tutorial:
    </p>

    <br/>

    {#if !seeTutorial}
      <ButtonAction
        action={() => seeTutorial = true}
        visibleText="Ver tutorial"
        type="white"
      />
    {:else}
      <Card>
        <dl>
          <dt><h3>Como realizar el control de tu entorno?</h3></dt>
          <dd>
            <p>Para realizar esto tendras que tener a la mano tu dispositivo, 
              ahora dirigite a la seccion de mediciones desde donde podras conectar el dispositivo y 
              automaticamente este recolectara los datos del entorno en donde te encuentras. </p>
          </dd>
        </dl>

        <dl>
          <dt><h3>Como ver el mapa con los datos?</h3></dt>
          <dd>
            <p>Dirigete a la seccion del mapa, aqui encontraras el mapa del mundo donde podras visualizar
              graficamente las condicioens medioambientales de la zona sercana a donde estas.</p>
            <p>Los datos que podras ver son los tomados por todos los usuarios de <i style="color: #28706C;">EcoBox</i> que esten 
              mas actualizados y puedan ser de tu interes.</p>
          </dd>
        </dl>

        <dl>
          <dt><h3>Deseas conocer mas sobre temas medioambientales?</h3></dt>
          <dd>
            <p>Te invitamos a que revises las cortas publicaciones que se encuentran en las seccion de noticias,
              aqui podras encontrar informacion sobre temas como la contaminacion, el agua, el clima, etc.</p>
            <p>Pero si realmente te apasiona el tema, te animamos a que investigues articulos cientificos que traten el tema con mayor profundidad.</p>
          </dd>
        </dl>

        <ButtonAction
          action={() => seeTutorial = false}
          visibleText="Ocultar tutorial"
          type="white"
        />
      </Card>
    {/if}
  </Card>
</Section>


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
          Ultima medicion realizada el {data[0].createdAt.toDate().toLocaleString()}
        </p>
      {:else}
        <p>Tadavia no tienes mediciones, dirigete a la pagina de mediciones y realiza tu primera!</p>
      {/if}
    {:catch { err }}
      <p>Error al cargar la ultima medición</p>
    {/await}

    <ButtonLink
      route={userRouteToDoNewMeasurement}
      visibleText="Ir a realizar una medición ahora"
      type="yellow"
    />
  </Card>
</Section>


<!-- <Section title="Noticias">
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
</Section> -->


<style>
  dt {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0.4rem;
    color: rgb(153 74 55);
  }

  dl {
    margin: 0;
    padding: 0;
    margin-bottom: 0.6rem;
  }

  dd {
    color: #666;
  }
</style>
