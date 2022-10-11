<script lang="ts">
  import { UserInfo } from '$lib/stores/userStores';
  import { getAuth } from 'firebase/auth';
  import { onAuthStateChanged } from 'firebase/auth';
  import '$lib/firebase/config.ts';
  import '../app.css';

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let name = user.displayName || '';
      let userUrl = `/${name.replace(/\s+/g, '').toLowerCase()}`;
      
      UserInfo.set({ isLoggin: true, user, userUrl });
    }
    else {
      UserInfo.set({ isLoggin: false });
    }
  });
</script>

<slot />
