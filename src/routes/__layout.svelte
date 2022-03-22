<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { getAuth, onAuthStateChanged  } from 'firebase/auth';
	import '$lib/firebase/firebase.js';
	import '../app.css';

	import LoginPrompt from '$lib/LoginPrompt.svelte';

	
  let verifyUserPromise = Promise.resolve({ isLogin: false });

  const startUserVerification = () => {
    let auth = getAuth();

    verifyUserPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
				if (user) {
          let name = user.displayName || '';
        
        	if (name.length > 0) {
						let userUrl = name.replace(/\s+/g, '').toLowerCase();
						goto(`/${userUrl}/home`);
						return resolve({ isLogin: true });
					}
				}
        
        goto('/');
        return resolve({ isLogin: false });
      });
    });
  };

  onMount(startUserVerification);
</script>



<svelte:head>
	<title>SISTEAM 2022</title>
</svelte:head>

{#await verifyUserPromise}
	<main class="loading">
	</main>
{:then { isLogin }}
	{#if !isLogin}
		<main in:fade class="not-login">
			<LoginPrompt />
		</main>
	{/if}
{/await}



<style>
	main{
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
