<script type="ts">
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import { onMount } from 'svelte';

  onMount(() => {
    UserInfo.subscribe(({ isLoggin, userUrl}) => {
      if (isLoggin) goto(`${userUrl}/home`);
    });
  })
</script>


<main>
  <slot />
</main>

<style>
  main {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: var(--green-b);
  }
</style>
