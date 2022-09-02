<script>
  import { goto } from '$app/navigation';
  import { loginWithEmail } from '$lib/firebase/services';
  import { getAuth, onAuthStateChanged  } from 'firebase/auth';
  import { onMount } from 'svelte';
	import '$lib/firebase/firebase.js';
	import '../../../app.css';

  let email = '';
  let password = '';
  let unsuscriptionAuthState = undefined;
	
  const startUserVerification = () => {
    const auth = getAuth();

    unsuscriptionAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        let name = user.displayName || '';
        
        if (name.length > 0) {
          let userUrl = `/${name.replace(/\s+/g, '').toLowerCase()}/home`;
          goto(userUrl);
        }
      }
    });
  }
  
  const handleSubmintLogin = async () => {
    unsuscriptionAuthState();

    const userData = { email, password };
    const { success, err, user } = await loginWithEmail(userData).catch(err => err) ;

    if (success) {
			let userUrl = `/${user.user.displayName.replace(/\s+/g, '').toLowerCase()}/`;
      setTimeout(() => goto(userUrl), 500);
    } else {
      alert(err);
    }
  };

  onMount(startUserVerification);
</script>


<svelte:head>
	<title>Iniciar sesion</title>
</svelte:head>

<div class="container">
  <div>
    <form on:submit|preventDefault={handleSubmintLogin}>
      <input
        required
        bind:value={email}
        placeholder="Correo electronico"
        type="email"
      />
      <input
        required
        bind:value={password}
        placeholder="Contraseña"
        type="password"
      />
      <button type="submit">Iniciar sesion</button>
    </form>
  </div>
  <a href="/auth/singin">Crear nueva cuenta</a>
</div>


<style>
  * {
    display: block;
    width: 100%;
  }

  .container {
    width: 100%;
    padding: 3.5em 1.5em;
    margin-top: 50%;
  }

  form * {
    padding: 0.8em;
    margin: 0.5em 0;
    outline: none;
    border: none;
    font-size: 1rem;
    transition: all 0.3s;
  }

  form input {
    background: none;
    border-bottom: 4px solid var(--green-w);
    color: var(--green-w);
    margin: 1em 0;
  }

  form input::placeholder {
    color: var(--green-w);
    opacity: 0.7;
  }

  form input:active,
  form input:focus {
    box-shadow: 0 0 0 2.5px var(--green-w);
  }

  form button {
    text-align: center;
    cursor: pointer;
    font-weight: 700;
    border-radius: 0.3em;
    background-color: var(--yellow);
    color: var(--green-b);
    margin-top: 1em;
  }

  form button:hover {
    filter: brightness(1.2);
  }

  form button:active,
  form button:focus {
    box-shadow: 0 0 0 1.5px var(--white);
  }

  a {
    width: 100%;
    text-align: center;
    color: var(--green-w);
    opacity: 0.7;
    font-weight: 700;
    margin-top: 2rem;
  }
</style>
