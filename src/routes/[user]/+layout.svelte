<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import NavLink from '$lib/NavLink.svelte';
  import { onMount } from 'svelte';

  let isTheUserCorrect = false;


  onMount(() => {
    UserInfo.subscribe(({ isLoggin, userUrl }) => {
      if (!isLoggin) {
        goto('/');
      }
      else {
        let path = $page.url.pathname;
        isTheUserCorrect = path.includes(userUrl!);
      }
    });
  });
</script>

<svelte:head>
  <title>EcoBox {isTheUserCorrect ? `: ${$page.params.user}` : ''}</title>
</svelte:head>

{#if $UserInfo.isLoggin}
  <NavLink userRef={$UserInfo.userUrl} />
  <main>
    <slot />
  </main>
{:else}
  <main>
    <h1>Verificando usuario</h1>
  </main>
{/if}

<style>
  main {
    padding: 1.5rem 0.5rem 120px 0.5rem;
    min-height: 100vh;
    background-color: #e9e9e9;
  }
</style>
