<script lang="ts">
  import { getUserData } from '$lib/firebase/firestore';
  import { EXTEND_NAMES } from '$lib/controlData/utilDataTypes';
  import { getAuth } from 'firebase/auth';
  import type { Timestamp } from 'firebase/firestore';
  import type { MeassurePack } from './types/meassureType';

  export let cityName: string;
  export let update: Timestamp;
  export let country: string;

  let isActive = false;
  let getCitiesMessurementPromise: Promise<{ success: boolean, data?: MeassurePack[] }> = Promise.resolve({ success: true, data: [] });

  const handleClick = () => {
    isActive = !isActive;

    if (isActive) {
      let user = getAuth().currentUser;
      getCitiesMessurementPromise = getUserData(user?.uid ?? '', cityName, 10);

    } else {
      getCitiesMessurementPromise = Promise.resolve({ success: true, data: [] });
    }
  };
</script>

<article>
  <div class={`title ${isActive ? 'active' : ''}`} on:click={handleClick}>
    <div>
      <p>{cityName}, {country}</p>
      <p class="mini">{update.toDate().toLocaleString()}</p>
    </div>

    <div class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-down"
        ><polyline points="6 9 12 15 18 9" /></svg
      >
    </div>
  </div>

  {#if isActive}
    <div class="content">
      {#await getCitiesMessurementPromise}
        <p>Cargando...</p>
      
      {:then { success, data }}
        {#if success}
          {#if data && data.length > 0}

            {#each data as { meassures, createdAt }}
              <div class="messure-cont">
                <p>{createdAt.toDate().toLocaleString()}</p>
                <ul>
                  {#each meassures as { name, unit, value }}
                    <li>
                      <div class="icon" style={`color: rgb(40, 112, 107);`} />
                      <p>{EXTEND_NAMES[name]} - {value} {unit}</p>
                    </li>
                  {/each}
                </ul>
              </div>
            {/each}
          {:else}
          <p>Parece que no hay mediciones almacenadas en esta ciudad...</p>
          {/if}
        {:else}
          <p>Ha ocurrido un error</p>
        {/if}
      {/await}
    </div>
  {/if}
</article>

<style>
  .messure-cont {
    margin-bottom: 1rem;
    border-bottom: 1px solid rgb(146, 146, 146);
    padding: 0.4rem 0.4rem 1rem 0.4rem;
  }

  .messure-cont ul {
    list-style: none;
    margin-left: 1rem;
  }

  .messure-cont ul li {
    display: flex;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .messure-cont ul li .icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    border-radius: 100%;
    background-color: currentColor;
  }

  article {
    box-shadow: 0 0 3px 0 #66666670;
    border-radius: 0.5rem;
  }

  .content {
    padding: 0.8rem 1.2rem;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1.2rem;
    background: rgb(238, 238, 238);
    box-shadow: 0 0 3px 0 #66666670;
    border-radius: 0.5rem;
    margin-top: 1rem;
    cursor: pointer;
  }

  .title > div > p {
    margin: 0;
  }

  .icon {
    margin-left: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title.active {
    background: rgb(255, 255, 255);
  }

  .title.active .icon {
    transform: rotate(180deg);
  }

  .mini {
    font-size: 0.8rem;
    color: #666666;
  }
</style>
