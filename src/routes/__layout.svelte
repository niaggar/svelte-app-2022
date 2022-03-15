<script>
	import { fade } from 'svelte/transition';
	import Header from '$lib/Header.svelte';
	import LoginPrompt from '$lib/LoginPrompt.svelte';
	import '../app.css';

	
	let isLogined = false;
	let isLoaded = false;


	setTimeout(() => {
		isLoaded = true;
		isLogined = false;
	}, 1000);
</script>


<svelte:head>
	<title>SISTEAM 2022</title>
</svelte:head>

{#if isLoaded}
	{#if isLogined}
		<Header />
		<main class="is-login">
			<slot />
		</main>
	{:else}
		<main in:fade class="not-login">
			<LoginPrompt />
		</main>
	{/if}
{:else}
	<main class="loading">
	</main>
{/if}


<style>
	main{
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	main.not-login {
		background-color: var(--green-b);
	}

	main.is-login {
		background-color: var(--white);
	}

	main.loading {
		background-color: var(--green-b);
	}
</style>
