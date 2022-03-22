<script>
	import { page } from '$app/stores';

	export let userRef = '';
</script>


<nav>
	<ul>
		<li>
			<a href={'/' + userRef + '/home'} class:active="{$page.url.pathname === '/' + userRef + '/home'}">		
				<svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#F3F6F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
					<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
					<polyline points="9 22 9 12 15 12 15 22"></polyline>
				</svg>
				<span>Home</span>
			</a>
		</li>

		<li>
			<a href={'/' + userRef + '/feed'} class:active="{$page.url.pathname === '/' + userRef + '/feed'}">
				<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#F3F6F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-rss">
					<path d="M4 11a9 9 0 0 1 9 9"></path>
					<path d="M4 4a16 16 0 0 1 16 16"></path>
					<circle cx="5" cy="19" r="1"></circle>
				</svg>
				<span>Feed</span>
			</a>
		</li>

		<li>
			<a href={'/' + userRef +"/statistics"} class:active="{$page.url.pathname === '/' + userRef + '/statistics'}">		
				<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#F3F6F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart">
					<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
					<path d="M22 12A10 10 0 0 0 12 2v10z"></path>
				</svg>
				<span>Statistics</span>
			</a>
		</li>

		<li>
			<a href={'/' + userRef + "/settings"} class:active="{$page.url.pathname === '/' + userRef + '/settings'}">		
				<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#F3F6F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings">
					<circle cx="12" cy="12" r="3"></circle>
					<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
				</svg>
				<span>Settings</span>
			</a>
		</li>
	</ul>
</nav>



<style>
	nav {
		padding: 0 1em;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: var(--green-b);
		height: 80px;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	li a {
		color: var(--white);
		text-decoration: none;
		cursor: pointer;
		margin: 0 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	li a span {
		display: none;
	}

	li a.active span{
		display: block;
	}

	a svg {
		width: 40px;
		height: 40px;
	}
</style>
