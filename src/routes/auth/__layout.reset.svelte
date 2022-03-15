<script>
	import { getAuth, onAuthStateChanged  } from 'firebase/auth';
	import '../../app.css';

	const auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		console.log(user);

		if (user) {
			console.log('user logged in');

			let name = user.displayName;
			let userUrl = `/${name.replace(/\s+/g, '').toLowerCase()}/`;

			console.log(userUrl);

		} else {
			console.log('user logged out');
		}
	});

</script>


<main>
  <slot />
</main>



<style>
	main{
		display: flex;
		width: 100vw;
		height: 100vh;
    background-color: var(--green-b);
	}
</style>
