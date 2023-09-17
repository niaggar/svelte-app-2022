<script lang="ts">
  import '$lib/firebase/config';

  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import NavLink from '$lib/NavLink.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        UserInfo.set({ isLoggin: true, user });
      }
      else {
        UserInfo.set({ isLoggin: false });
        goto('login');
      }
    });
  });
</script>

<svelte:head>
  <title>EcoBox</title>
</svelte:head>

{#if $UserInfo.isLoggin}
  <NavLink />

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
