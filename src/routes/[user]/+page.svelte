<script type="ts">
  import { goto } from '$app/navigation';
  import { UserInfo } from '$lib/stores/userStores';

  UserInfo.subscribe(({ isLoggin, userUrl}) => {
    if (isLoggin) goto(`${userUrl}/home`);
    else goto('/');
  });
</script>
