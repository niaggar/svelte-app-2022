<script>
  import ButtonAction from '$lib/ButtonAction.svelte';
  import { getAuth, signOut } from 'firebase/auth';

  const logout = () => {
    const auth = getAuth();
    
    signOut(auth);
  };
</script>


<div class='container'>
  <h1>Configuracion</h1>
  <ButtonAction visibleText='Cambiar nombre de usuario' type='gray' action={() => {}}/>
  <ButtonAction visibleText='Privacidad de las mediciones' type='gray' action={() => {}}/>
  <ButtonAction visibleText='Cerrar sesion' type='gray' action={() => {}}/>

  <ButtonAction visibleText='Cerrar sesion' type='orange' action={logout}/>
</div>



<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20vh 1rem 0rem 1rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    opacity: rgb(92, 92, 92);
  }
</style>