<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import LoginPrompt from '$lib/LoginPrompt.svelte';

  let verifyUserPromise = Promise.resolve({ isLogin: false });

  const startUserVerification = () => {
    let auth = getAuth();

    verifyUserPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          let name = user.displayName || '';

          if (name.length > 0) {
            let userUrl = name.replace(/\s+/g, '').toLowerCase();
            await goto(`/${userUrl}/home`);
          }
        }

        return resolve({ isLogin: false });
      });
    });
  };

  onMount(startUserVerification);
</script>

<svelte:head>
  <title>EcoBox</title>
</svelte:head>

{#await verifyUserPromise}
  <main class="loading" />
{:then { isLogin }}
  {#if !isLogin}
    <main in:fade class="not-login">
      <LoginPrompt />
    </main>
  {/if}
{/await}

<style>
  main {
    display: flex;
    width: 100vw;
    height: 100vh;
  }

  main.not-login {
    background-color: var(--green-b);
  }

  main.loading {
    background-color: var(--green-b);
  }
</style>
