<script>
  import { page } from '$app/stores';

  export let userRef = '';
</script>

<nav>
  <div>
    <a
      href={'/' + userRef + '/home'}
      class:active={$page.url.pathname === '/' + userRef + '/home'}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#18322d"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-home"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span>Home</span>
    </a>

    <a
      href={'/' + userRef + '/mapa'}
      class:active={$page.url.pathname === '/' + userRef + '/mapa'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#18322d"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-map"
        ><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line
          x1="8"
          y1="2"
          x2="8"
          y2="18"
        /><line x1="16" y1="6" x2="16" y2="22" /></svg
      >
      <span>Mapa</span>
    </a>

    <a
      href={'/' + userRef + '/estadisticas'}
      class:active={$page.url.pathname === '/' + userRef + '/estadisticas'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#18322d"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-pie-chart"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
      <span>Medicion</span>
    </a>

    <a
      href={'/' + userRef + '/ajustes'}
      class:active={$page.url.pathname === '/' + userRef + '/ajustes'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#18322d"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-settings"
      >
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </svg>
      <span>Ajustes</span>
    </a>
  </div>
</nav>

<style>
  nav {
    padding: 0.3em 0.4rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(113, 181, 170);
    box-shadow: 0 0 3px 0 #66666670;
		z-index: 999;
    height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  div {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: column;
  }

  a {
    color: rgb(24, 50, 45);
    text-decoration: none;
    cursor: pointer;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
    padding: 1rem 0.4rem 0.8rem 0.4rem;
    border-radius: 1rem;
    background: transparent;
    border: 2px solid transparent;
    overflow: hidden;
  }

  a span {
    font-weight: bold;
    margin-top: 5px;
    opacity: 0;
    font-size: 0.9em;
  }

  a.active {
    opacity: 1;
    background-color: rgba(24, 50, 45, 0.116);
    border: 2px solid rgba(229, 255, 251, 0.199);
  }

  a.active span {
    opacity: 1;
  }

  a svg {
    width: 30px;
    height: 30px;
  }
</style>
