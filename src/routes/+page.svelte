<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import LoginPrompt from '$lib/LoginPrompt.svelte';

  let verifyUserPromise = Promise.resolve({ isLogin: false });

  const startUserVerification = () => {
    verifyUserPromise = new Promise((resolve, reject) => {
      UserInfo.subscribe(({ isLoggin, userUrl }) => {
        if (isLoggin) {
          goto(`${userUrl}/home`);
          resolve({ isLogin: true });
        } else {
          resolve({ isLogin: false });
        }
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
