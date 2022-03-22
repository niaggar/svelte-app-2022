<script>
  import ButtonLink from '$lib/ButtonLink.svelte';
  import ButtonAction from '$lib/ButtonAction.svelte';
  import { getAuth, signOut } from 'firebase/auth';

  const logout = () => {
    const auth = getAuth();
    
    signOut(auth);
  };
</script>


<div class='container'>
  <h1>Pagina de configuracion</h1>
  <ButtonLink visibleText='prueba de boton' type='orange'/>
  <ButtonAction visibleText='Cerrar sesion' type='orange' action={logout}/>
</div>



<style>
  .container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
</style>