<script>
	import Header from '$lib/Header.svelte';
	import LoginPrompt from '$lib/LoginPrompt.svelte';
	import '../app.css';

	let isLogined = false;
	let loading = true;

	setTimeout(() => {
		loading = false;
		isLogined = false;
	}, 500);
</script>



{#if loading}
	<div class="loading">
		<h1>Cargando informacion</h1>
	</div>
{:else}

	{#if isLogined}
		<Header />
		<main class="is-login">
			<slot />
		</main>
	{:else}
		<main class="not-login">
			<LoginPrompt />
		</main>
	{/if}

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
</style>
