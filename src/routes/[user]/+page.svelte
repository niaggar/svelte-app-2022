<script type="ts">
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';
  import { onMount } from 'svelte';

  onMount(() =>
    UserInfo.subscribe(({ isLoggin, userUrl }) => {
      if (isLoggin) goto(`${userUrl}/home`);
      else goto('/');
    })
  );
</script>
