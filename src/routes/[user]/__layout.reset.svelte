<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
	import { getAuth, onAuthStateChanged  } from 'firebase/auth';
  import { onMount } from 'svelte';
  import '$lib/firebase/firebase.js';

  import NavLink from '$lib/NavLink.svelte';


  let isTheUserCorrect = false;
  let verifyUserPromise = Promise.resolve({ isOkey: false });

  const startUserVerification = () => {
    let auth = getAuth();

    verifyUserPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          let name = user.displayName || '';
        
          if (name.length > 0) {
            let userUrl = name.replace(/\s+/g, '').toLowerCase();
            let path = $page.url.pathname;

            if (path.includes(userUrl)) {
              isTheUserCorrect = true;
              console.log(userUrl, path);
              return resolve({ isOkey: true, user: userUrl });
            }
          }
        }
        
        goto('/');
        return resolve({ isOkey: false });
      });
    });
  };

  onMount(startUserVerification);
</script>


<svelte:head>
  <title>Svelte App {isTheUserCorrect ? `: ${$page.params.user}` : ''}</title>
</svelte:head>

{#await verifyUserPromise}
  <main>
    <h1>Verificando usuario</h1>
  </main>
{:then { isOkey, user }}
  {#if isOkey}
    <NavLink userRef={user}/>
    <main>
      <slot />
    </main>
  {/if}
{/await}
