<script type="ts">
  import '$lib/firebase/config';
  
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import { onMount } from 'svelte';

  onMount(() => {
    UserInfo.subscribe(({ isLoggin }) => {
      if (isLoggin) goto('/');
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
