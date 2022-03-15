<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged  } from 'firebase/auth';

	const auth = getAuth();
  let userUrlName = '';
  let isTheUserCorrect = new Promise();

	onAuthStateChanged(auth, (user) => {
		if (user) {
			let name = user.displayName;
			userUrlName = name.replace(/\s+/g, '').toLowerCase();
		} else {
			userUrlName = '';
		}
	});

  const verifyConection = () => {
    // Verificar que usuario este conectado ...
    const user = {
      isLogin: true,
      name: 'Juan Perez',
      shortName: 'juan'
    };

    let userName = $page.params.user;

    if (!user.isLogin || userName !== user.shortName) {
      goto('/');
      return;
    }

    isTheUserCorrect = true;
  }


  onMount(() => {
    verifyConection();
  });
</script>


<svelte:head>
  <title>Home: {isTheUserCorrect ? `: ${$page.params.user}` : ''}</title>
</svelte:head>

{#if isTheUserCorrect}
  <main>
    <slot />
  </main>
{:else}
  <main>
    <h1>Verificando usuario</h1>
  </main>
{/if}
