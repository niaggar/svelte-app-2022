<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getAuth, onAuthStateChanged  } from 'firebase/auth';

  const startUserVerification = () => {
    let auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        let name = user.displayName || '';
        
        if (name.length > 0) {
          let name = user.displayName;
          let userUrl = name.replace(/\s+/g, '').toLowerCase();
          goto(`/${userUrl}/home`);
        }
      }
    });
  };

  onMount(startUserVerification);
</script>