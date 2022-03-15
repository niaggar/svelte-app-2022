<script>
  import ButtonLink from '$lib/ButtonLink.svelte'
</script>


<div class='container'>
  <div>
    <h1>Bienvenid@ a <span>SISTEAM-APP 2022</span></h1>
    <p>Para poder disfrutar de todas las funcionalidades te invitamios a que crees una nueva cuenta cuenta, o inicies sesion en una ya existente.</p>
  </div>

  <div>
    <ButtonLink visibleText='Iniciar sesion' route='auth/login' type='yellow'/>
    <ButtonLink visibleText='Crear nueva cuenta' route='auth/singin' type='green'/>
  </div>
</div>


<style>
  .container {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    padding: 2em;
    overflow: hidden;
    background-color: rgba(209, 249, 246, 0.219);
  }

  .container div {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  h1 {
    font-size: 2em;
    font-weight: lighter;
    text-align: center;
    margin-bottom: 0.5em;
    color: var(--white);
  }

  h1 span {
    color: var(--yellow);
    font-weight: bold;
  }

  p {
    font-size: auto;
    text-align: center;
    margin-bottom: 1em;
    color: var(--green-w2);  
  }

  .container:before,
  .container:after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 300vw;
    min-height: 300vw;
    background-color: var(--green-b);
    animation-name: rotate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  
  .container:before {
    bottom: 75vh;
    border-radius: 45%;
    animation-duration: 20s;
  }
  
  .container:after {
    bottom: 22vh;
    opacity: .5;
    border-radius: 47%;
    animation-duration: 15s;
  }

  @keyframes rotate {
    0% {transform: translate(-50%, 0) rotateZ(0deg);}
    50% {transform: translate(-50%, -2%) rotateZ(180deg);}
    100% {transform: translate(-50%, 0%) rotateZ(360deg);}
  }
</style>
