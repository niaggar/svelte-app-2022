<script lang="ts">
  import { loginWithEmail } from '$lib/firebase/services';

  let email = '';
  let password = '';

  const handleSubmintLogin = async () => {
    const { success } = await loginWithEmail(email, password);

    if (!success) {
      alert('Error al iniciar sesión');
    }
  };
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
  <a href="/singin">Crear nueva cuenta</a>
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
